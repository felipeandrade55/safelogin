import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Company } from "@/types/company";

export const useCompanies = () => {
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, created_at')
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar empresas:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    meta: {
      onError: (error: any) => {
        console.error('Erro ao buscar empresas:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as empresas",
          variant: "destructive",
        });
      }
    }
  });

  const addCompany = useMutation({
    mutationFn: async (company: { name: string }) => {
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select('id, name, created_at')
        .maybeSingle();
      
      if (error) {
        console.error('Erro ao adicionar empresa:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Dados não retornados após inserção');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar a empresa",
        variant: "destructive",
      });
    },
  });

  return {
    companies,
    isLoading,
    addCompany,
  };
};