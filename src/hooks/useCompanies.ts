import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useCompanies = () => {
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('Fetching companies...');
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, created_at')
        .order('name');
      
      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
      
      console.log('Companies fetched:', data);
      return data;
    },
  });

  const addCompany = useMutation({
    mutationFn: async (company: { name: string }) => {
      console.log('Adding company:', company);
      const { data, error } = await supabase
        .from('companies')
        .insert(company)
        .select('id, name, created_at')
        .single();
      
      if (error) {
        console.error('Error adding company:', error);
        throw error;
      }
      
      console.log('Company added:', data);
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