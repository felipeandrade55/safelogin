import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useUserCompany() {
  return useQuery({
    queryKey: ['user-company'],
    queryFn: async () => {
      if (!supabase) return null;
      
      const { data: companyUsers } = await supabase
        .from('company_users')
        .select('company_id')
        .limit(1);
      
      if (!companyUsers?.length) return null;
      
      return companyUsers[0].company_id;
    },
  });
}