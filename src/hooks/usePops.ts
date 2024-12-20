import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const usePops = () => {
  const queryClient = useQueryClient();

  const { data: pops = [], isLoading } = useQuery({
    queryKey: ['pops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pops')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const addPop = useMutation({
    mutationFn: async ({ name, address }: { name: string; address: string }) => {
      const { data, error } = await supabase
        .from('pops')
        .insert({ name, address })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pops'] });
    },
  });

  return {
    pops,
    isLoading,
    addPop,
  };
};