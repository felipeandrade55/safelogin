import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CompanyRegistration() {
  const [companyName, setCompanyName] = useState("");
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
      console.log('Iniciando cadastro da empresa...');
      
      // Insere a empresa
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{ 
          name: companyName.trim() 
        }])
        .select('id, name')
        .single();

      if (companyError) {
        console.error('Erro ao criar empresa:', companyError);
        throw companyError;
      }

      if (!companyData) {
        throw new Error('Dados da empresa não retornados após inserção');
      }

      console.log('Empresa criada:', companyData);

      // Adiciona o usuário atual como admin
      const { error: userError } = await supabase
        .from('company_users')
        .insert([{
          company_id: companyData.id,
          user_id: user.id,
          role: 'admin'
        }]);

      if (userError) {
        console.error('Erro ao adicionar usuário à empresa:', userError);
        throw userError;
      }

      console.log('Usuário adicionado como admin');

      toast({
        title: "Sucesso",
        description: "Empresa registrada com sucesso!",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Erro no registro:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar empresa",
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
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrar Empresa"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}