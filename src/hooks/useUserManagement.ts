import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role?: string;
  is_safelogin_admin: boolean;
  company_id?: string;
}

export function useUserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url, is_safelogin_admin, phone, bio")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      return profile;
    },
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", currentUser?.is_safelogin_admin],
    queryFn: async () => {
      if (!currentUser) return [];

      if (currentUser.is_safelogin_admin) {
        const { data: allUsers, error } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url, is_safelogin_admin");

        if (error) throw error;
        return allUsers.map(user => ({
          ...user,
          role: "N/A"
        })) as User[];
      } else {
        const { data: companyUsers, error } = await supabase
          .from("company_users")
          .select(`
            user_id,
            role,
            company_id,
            profiles:user_id (
              id,
              full_name,
              email,
              avatar_url,
              is_safelogin_admin
            )
          `);

        if (error) throw error;

        return companyUsers.map((cu) => ({
          ...cu.profiles,
          role: cu.role,
          company_id: cu.company_id
        })) as User[];
      }
    },
    enabled: !!currentUser,
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    }
  };

  return {
    currentUser,
    users,
    isLoading,
    handleDeleteUser,
  };
}