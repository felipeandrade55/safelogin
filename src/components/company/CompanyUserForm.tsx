import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CompanyUserFormProps {
  companyId: string;
  onUserAdded: () => void;
}

export const CompanyUserForm = ({ companyId, onUserAdded }: CompanyUserFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"reader" | "technician" | "admin">("reader");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, check if the user exists in profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData) {
        toast({
          title: "Usuário não encontrado",
          description: "Este e-mail não está cadastrado no sistema.",
          variant: "destructive",
        });
        return;
      }

      // Check if user is already in the company
      const { data: existingUser, error: existingError } = await supabase
        .from('company_users')
        .select('id')
        .eq('company_id', companyId)
        .eq('user_id', profileData.id)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existingUser) {
        toast({
          title: "Usuário já cadastrado",
          description: "Este usuário já está vinculado a esta empresa.",
          variant: "destructive",
        });
        return;
      }

      // Add user to company
      const { error: insertError } = await supabase
        .from('company_users')
        .insert([
          {
            company_id: companyId,
            user_id: profileData.id,
            role: role
          }
        ]);

      if (insertError) throw insertError;

      toast({
        title: "Sucesso",
        description: "Usuário adicionado à empresa com sucesso!",
      });

      setEmail("");
      setRole("reader");
      onUserAdded();

    } catch (error: any) {
      console.error('Erro ao adicionar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o usuário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail do Usuário</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite o e-mail do usuário"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Função</Label>
        <Select value={role} onValueChange={(value: "reader" | "technician" | "admin") => setRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reader">Leitor</SelectItem>
            <SelectItem value="technician">Técnico</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adicionando..." : "Adicionar Usuário"}
      </Button>
    </form>
  );
};