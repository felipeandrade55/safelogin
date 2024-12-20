import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useManufacturers = () => {
  const queryClient = useQueryClient();

  const { data: manufacturers = [], isLoading } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const addManufacturer = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('manufacturers')
        .insert({ name })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturers'] });
    },
  });

  return {
    manufacturers,
    isLoading,
    addManufacturer,
  };
};