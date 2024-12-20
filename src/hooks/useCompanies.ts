import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCompanies = () => {
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('Buscando empresas...');
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, created_at')
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar empresas:', error);
        throw error;
      }
      
      console.log('Empresas encontradas:', data);
      return data || [];
    },
  });

  const addCompany = useMutation({
    mutationFn: async (company: { name: string }) => {
      console.log('Adicionando empresa:', company);
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select('id, name, created_at')
        .single();
      
      if (error) {
        console.error('Erro ao adicionar empresa:', error);
        throw error;
      }
      
      console.log('Empresa adicionada:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  return {
    companies,
    isLoading,
    addCompany,
  };
};