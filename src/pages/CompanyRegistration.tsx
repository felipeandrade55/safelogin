import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CompanyForm } from "@/components/company/CompanyForm";
import { CompanyUserForm } from "@/components/company/CompanyUserForm";
import { CompanyUsersList } from "@/components/company/CompanyUsersList";

export default function CompanyRegistration() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/auth');
    }
  };

  useState(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  });

  const handleSubmit = async (data: {
    companyName: string;
    description: string;
    cnpj: string;
    address: string;
  }) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar uma empresa",
        variant: "destructive",
      });
      return;
    }

    if (!data.companyName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da empresa é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{
          name: data.companyName.trim(),
          description: data.description.trim(),
          cnpj: data.cnpj.trim(),
          address: data.address.trim()
        }])
        .select('id, name')
        .maybeSingle();

      if (companyError) throw companyError;
      if (!companyData) throw new Error('Dados da empresa não retornados após inserção');

      const { error: userError } = await supabase
        .from('company_users')
        .insert([{
          company_id: companyData.id,
          user_id: user.id,
          role: 'admin'
        }]);

      if (userError) {
        console.error('Erro ao adicionar usuário à empresa:', userError);
        await supabase
          .from('companies')
          .delete()
          .eq('id', companyData.id);
        throw new Error('Não foi possível adicionar você como administrador da empresa');
      }

      setCompanyId(companyData.id);
      toast({
        title: "Sucesso",
        description: "Empresa registrada com sucesso!",
      });

    } catch (error: any) {
      console.error('Erro no registro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível cadastrar a empresa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = () => {
    // CompanyUsersList will handle the reload internally
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Registrar Nova Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyForm
            onSubmit={handleSubmit}
            loading={loading}
            disabled={!!companyId}
          />
        </CardContent>
      </Card>

      {companyId && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Gerenciar Usuários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CompanyUserForm
              companyId={companyId}
              onUserAdded={handleUserChange}
            />
            <Separator />
            <CompanyUsersList
              companyId={companyId}
              onUserRemoved={handleUserChange}
            />
          </CardContent>
        </Card>
      )}

      {companyId && (
        <div className="flex justify-center">
          <Button onClick={() => navigate('/')}>
            Ir para o Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}