import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const sampleCompanies = [
  {
    name: "Empresa Exemplo 1",
    cnpj: "11.111.111/0001-11",
    address: "Rua das Flores, 123 - Centro",
    description: "Empresa exemplo para demonstração do sistema"
  },
  {
    name: "Empresa Exemplo 2",
    cnpj: "22.222.222/0001-22",
    address: "Avenida Principal, 456 - Jardim América",
    description: "Segunda empresa exemplo para testes"
  },
  {
    name: "Empresa Exemplo 3",
    cnpj: "33.333.333/0001-33",
    address: "Praça Central, 789 - Vila Nova",
    description: "Terceira empresa exemplo para demonstração"
  }
];

export const insertSampleCompanies = async () => {
  try {
    // Primeiro, verifica se há um usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para criar empresas",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase
      .from('companies')
      .insert(sampleCompanies)
      .select();

    if (error) {
      console.error('Erro ao criar empresas:', error);
      throw error;
    }

    toast({
      title: "Sucesso",
      description: "Empresas de exemplo criadas com sucesso!",
    });

    return data;
  } catch (error: any) {
    console.error('Erro ao criar empresas de exemplo:', error);
    toast({
      title: "Erro",
      description: "Não foi possível criar as empresas de exemplo: " + error.message,
      variant: "destructive",
    });
    return null;
  }
};