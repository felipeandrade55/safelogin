import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Company } from "@/types/company";

export const useCompanies = () => {
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name, created_at')
          .order('name');
        
        if (error) throw error;
        
        return data || [];
      } catch (error: any) {
        console.error('Erro ao buscar empresas:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as empresas",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });

  const addCompany = useMutation({
    mutationFn: async (company: { name: string }): Promise<Company> => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .insert([company])
          .select()
          .single();
        
        if (error) throw error;
        if (!data) throw new Error('Dados não retornados após inserção');
        
        return data;
      } catch (error: any) {
        console.error('Erro ao adicionar empresa:', error);
        throw new Error(error.message || "Não foi possível adicionar a empresa");
      }
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