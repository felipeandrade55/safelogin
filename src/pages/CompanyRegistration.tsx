import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CompanyForm } from "@/components/company/CompanyForm";

export default function CompanyRegistration() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

    setLoading(true);

    try {
      // Start a transaction by inserting the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.companyName,
          description: data.description || null,
          cnpj: data.cnpj || null,
          address: data.address || null
        })
        .select()
        .maybeSingle();

      if (companyError) {
        throw new Error(companyError.message);
      }

      if (!companyData) {
        throw new Error('Não foi possível criar a empresa');
      }

      // Insert company_user relation
      const { error: relationError } = await supabase
        .from('company_users')
        .insert({
          company_id: companyData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (relationError) {
        // If there's an error creating the relation, delete the company
        await supabase
          .from('companies')
          .delete()
          .eq('id', companyData.id);
        
        throw new Error(relationError.message);
      }

      toast({
        description: "Empresa registrada com sucesso!",
      });

      navigate('/');
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

  if (!user) return null;

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Registrar Nova Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyForm
            onSubmit={handleSubmit}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}