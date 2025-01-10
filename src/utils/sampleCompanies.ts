import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sampleCompanies } from "./sampleData/companies";
import { sampleCredentials } from "./sampleData/credentials";

async function ensureUserProfile(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not found");

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userData.user.email,
        full_name: userData.user.user_metadata.full_name || userData.user.email
      });

    if (profileError) throw profileError;
  }
}

async function createCompanyWithUser(company: typeof sampleCompanies[0], userId: string) {
  const { data: companyData, error: companyError } = await supabase
    .from('companies')
    .insert(company)
    .select()
    .single();

  if (companyError) throw companyError;

  const { error: userError } = await supabase
    .from('company_users')
    .insert({
      company_id: companyData.id,
      user_id: userId,
      role: 'admin'
    });

  if (userError) throw userError;

  return companyData;
}

async function createCredentialsForCompany(companyId: string) {
  for (const credential of sampleCredentials) {
    const { data: credData, error: credError } = await supabase
      .from('credentials')
      .insert({
        company_id: companyId,
        title: credential.title,
        card_type: credential.card_type
      })
      .select()
      .single();

    if (credError) throw credError;

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
  }
}

export async function insertSampleCompanies() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    console.log("Ensuring user profile exists...");
    await ensureUserProfile(user.id);

    console.log("Creating sample companies...");
    const createdCompanies = [];

    for (const company of sampleCompanies) {
      try {
        const companyData = await createCompanyWithUser(company, user.id);
        await createCredentialsForCompany(companyData.id);
        createdCompanies.push(companyData);
      } catch (error) {
        console.error(`Error creating company ${company.name}:`, error);
      }
    }

    toast({
      title: "Sucesso",
      description: "Empresas de exemplo criadas com sucesso!",
    });

    return createdCompanies;
  } catch (error) {
    console.error('Error creating sample companies:', error);
    toast({
      variant: "destructive",
      title: "Erro",
      description: "Erro ao criar empresas de exemplo. Verifique o console para mais detalhes.",
    });
    throw error;
  }
}