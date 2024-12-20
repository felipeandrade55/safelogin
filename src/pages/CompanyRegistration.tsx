import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function CompanyRegistration() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar uma empresa",
        variant: "destructive",
      });
      return;
    }

    if (!companyName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da empresa é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Primeiro, insere a empresa
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{ 
          name: companyName.trim() 
        }])
        .select()
        .single();

      if (companyError) {
        throw companyError;
      }

      if (!companyData) {
        throw new Error('Dados da empresa não retornados após inserção');
      }

      // Depois, adiciona o usuário como admin
      const { error: userError } = await supabase
        .from('company_users')
        .insert([{
          company_id: companyData.id,
          user_id: user.id,
          role: 'admin'
        }]);

      if (userError) {
        // Se houver erro ao adicionar o usuário, tenta remover a empresa criada
        await supabase
          .from('companies')
          .delete()
          .eq('id', companyData.id);
        throw userError;
      }

      toast({
        title: "Sucesso",
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

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Registrar Nova Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Digite o nome da empresa"
                disabled={loading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar Empresa"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}