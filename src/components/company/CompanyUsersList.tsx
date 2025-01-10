import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Profile {
  email: string | null;
  full_name: string | null;
}

interface CompanyUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface CompanyUsersListProps {
  companyId: string;
  onUserRemoved: () => void;
}

export const CompanyUsersList = ({ companyId, onUserRemoved }: CompanyUsersListProps) => {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('company_users')
        .select(`
          id,
          role,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .eq('company_id', companyId);

      if (error) throw error;

      if (data) {
        const mappedUsers: CompanyUser[] = data.map((user) => ({
          id: user.id,
          email: user.profiles?.email ?? '',
          full_name: user.profiles?.full_name ?? '',
          role: user.role ?? ''
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [companyId]);

  const handleRemoveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('company_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso!",
      });

      onUserRemoved();
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o usuário.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Usuários da Empresa</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div>
              <p className="font-medium">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-primary">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveUser(user.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            Nenhum usuário cadastrado
          </p>
        )}
      </div>
    </div>
  );
};