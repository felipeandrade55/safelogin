import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

const sampleCompanies = [
  {
    name: "Empresa Exemplo 1",
    cnpj: "11.111.111/0001-11",
    address: "Rua Principal, 123 - Centro",
    description: "Primeira empresa exemplo para demonstração"
  },
  {
    name: "Empresa Exemplo 2",
    cnpj: "22.222.222/0001-22",
    address: "Avenida Secundária, 456 - Jardim",
    description: "Segunda empresa exemplo para demonstração"
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

export async function insertSampleCompanies() {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Insert companies
    const { data, error } = await supabase
      .from('companies')
      .insert(sampleCompanies)
      .select();

    if (error) {
      throw error;
    }

    // Add current user to each company
    for (const company of data) {
      const { error: userError } = await supabase
        .from('company_users')
        .insert({
          company_id: company.id,
          user_id: user.id,
          role: 'admin'
        });

      if (userError) {
        console.error('Erro ao adicionar usuário à empresa:', userError);
        continue;
      }

      // Insert sample credentials for each company
      for (const credential of sampleCredentials) {
        try {
          // Insert credential
          const { data: credData, error: credError } = await supabase
            .from('credentials')
            .insert({
              company_id: company.id,
              title: credential.title,
              card_type: credential.card_type
            })
            .select()
            .single();

          if (credError) throw credError;

          // Insert access credentials
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

            if (accessError) throw accessError;

            // Insert user credentials
            for (const userCred of access.userCredentials) {
              const { error: userCredError } = await supabase
                .from('user_credentials')
                .insert({
                  access_credential_id: accessData.id,
                  username: userCred.username,
                  password: userCred.password
                });

              if (userCredError) throw userCredError;
            }
          }
        } catch (error) {
          console.error('Erro ao criar credencial:', error);
          continue;
        }
      }
    }

    toast({
      title: "Sucesso",
      description: "Empresas de exemplo criadas com sucesso!",
    });

    return data;
  } catch (error) {
    console.error('Erro ao criar empresas de exemplo:', error);
    toast({
      variant: "destructive",
      title: "Erro",
      description: "Erro ao criar empresas de exemplo. Verifique o console para mais detalhes.",
    });
    throw error;
  }
}