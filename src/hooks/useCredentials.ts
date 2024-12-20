import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Credential {
  id: string;
  company_id: string;
  title: string;
  card_type: string;
  manufacturer_id?: string;
  flags?: string[];
  is_deleted?: boolean;
  deleted_at?: string;
}

interface AccessCredential {
  id: string;
  credential_id: string;
  type: string;
  value: string;
  priority?: number;
  userCredentials: Array<{
    id: string;
    username?: string;
    password?: string;
  }>;
  comments?: string[];
}

export const useCredentials = (companyId?: string) => {
  const queryClient = useQueryClient();

  const { data: credentials = [], isLoading } = useQuery({
    queryKey: ['credentials', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data: credentialsData, error: credentialsError } = await supabase
        .from('credentials')
        .select(`
          *,
          access_credentials (
            *,
            user_credentials (
              *
            ),
            comments (
              *
            )
          )
        `)
        .eq('company_id', companyId)
        .eq('is_deleted', false);

      if (credentialsError) throw credentialsError;

      return credentialsData.map((cred) => ({
        ...cred,
        credentials: cred.access_credentials.map((access: any) => ({
          ...access,
          userCredentials: access.user_credentials || [],
          comments: access.comments?.map((c: any) => c.content) || [],
        })),
      }));
    },
    enabled: !!companyId,
  });

  const addCredential = useMutation({
    mutationFn: async ({
      credential,
      accessCredentials,
    }: {
      credential: Omit<Credential, 'id'>;
      accessCredentials: Omit<AccessCredential, 'id' | 'credential_id'>[];
    }) => {
      const { data: credentialData, error: credentialError } = await supabase
        .from('credentials')
        .insert(credential)
        .select()
        .single();

      if (credentialError) throw credentialError;

      const accessCredsWithId = accessCredentials.map(access => ({
        ...access,
        credential_id: credentialData.id,
      }));

      const { data: accessData, error: accessError } = await supabase
        .from('access_credentials')
        .insert(accessCredsWithId)
        .select()
        .order('priority');

      if (accessError) throw accessError;

      // Insert user credentials for each access credential
      for (const access of accessData) {
        const userCreds = accessCredentials.find(ac => ac.type === access.type)?.userCredentials;
        if (userCreds?.length) {
          const { error: userCredsError } = await supabase
            .from('user_credentials')
            .insert(
              userCreds.map(uc => ({
                ...uc,
                access_credential_id: access.id,
              }))
            );
          
          if (userCredsError) throw userCredsError;
        }
      }

      return credentialData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', companyId] });
    },
  });

  const updateCredential = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Credential>;
    }) => {
      const { data, error } = await supabase
        .from('credentials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', companyId] });
    },
  });

  const deleteCredential = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('credentials')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', companyId] });
    },
  });

  const restoreCredential = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('credentials')
        .update({
          is_deleted: false,
          deleted_at: null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', companyId] });
    },
  });

  return {
    credentials,
    isLoading,
    addCredential,
    updateCredential,
    deleteCredential,
    restoreCredential,
  };
};