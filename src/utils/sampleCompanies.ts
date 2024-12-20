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

const sampleCredentials = [
  {
    title: "Servidor Web Principal",
    card_type: "Servidor",
    access: [
      {
        type: "SSH",
        value: "192.168.1.100",
        userCredentials: [
          { username: "admin", password: "senha123" },
          { username: "root", password: "root123" }
        ]
      },
      {
        type: "HTTP",
        value: "https://servidor1.exemplo.com",
        userCredentials: [
          { username: "webadmin", password: "web123" }
        ]
      }
    ]
  },
  {
    title: "Roteador Core",
    card_type: "Roteador",
    access: [
      {
        type: "SSH",
        value: "10.0.0.1",
        userCredentials: [
          { username: "network", password: "net123" }
        ]
      },
      {
        type: "HTTPS",
        value: "https://10.0.0.1",
        userCredentials: [
          { username: "admin", password: "router123" }
        ]
      }
    ]
  },
  {
    title: "Switch de Distribuição",
    card_type: "Switch",
    access: [
      {
        type: "Telnet",
        value: "192.168.1.254",
        userCredentials: [
          { username: "admin", password: "switch123" }
        ]
      }
    ]
  },
  {
    title: "Banco de Dados Principal",
    card_type: "Banco de Dados",
    access: [
      {
        type: "PostgreSQL",
        value: "postgres://localhost:5432",
        userCredentials: [
          { username: "postgres", password: "pg123" },
          { username: "readonly", password: "read123" }
        ]
      }
    ]
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

    // Para cada empresa criada, insere as credenciais de exemplo
    for (const company of data) {
      for (const credential of sampleCredentials) {
        // Insere a credencial principal
        const { data: credData, error: credError } = await supabase
          .from('credentials')
          .insert({
            company_id: company.id,
            title: credential.title,
            card_type: credential.card_type
          })
          .select()
          .single();

        if (credError) {
          console.error('Erro ao criar credencial:', credError);
          continue;
        }

        // Insere os acessos para cada credencial
        for (const access of credential.access) {
          const { data: accessData, error: accessError } = await supabase
            .from('access_credentials')
            .insert({
              credential_id: credData.id,
              type: access.type,
              value: access.value
            })
            .select()
            .single();

          if (accessError) {
            console.error('Erro ao criar acesso:', accessError);
            continue;
          }

          // Insere as credenciais de usuário para cada acesso
          for (const userCred of access.userCredentials) {
            const { error: userCredError } = await supabase
              .from('user_credentials')
              .insert({
                access_credential_id: accessData.id,
                username: userCred.username,
                password: userCred.password
              });

            if (userCredError) {
              console.error('Erro ao criar credencial de usuário:', userCredError);
            }
          }
        }
      }
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