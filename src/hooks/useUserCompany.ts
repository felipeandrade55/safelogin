import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useUserCompany() {
  return useQuery({
    queryKey: ['user-company'],
    queryFn: async () => {
      console.log("Buscando empresa do usuário...");
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("ID do usuário:", user.id);

      const { data: companyUser, error } = await supabase
        .from('company_users')
        .select('company_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar empresa:", error);
        throw error;
      }

      if (!companyUser) {
        console.error("Usuário não está associado a nenhuma empresa");
        throw new Error("Usuário não está associado a nenhuma empresa");
      }

      console.log("Empresa encontrada:", companyUser);
      return companyUser.company_id;
    },
  });
}