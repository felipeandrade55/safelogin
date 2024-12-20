import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  is_safelogin_admin: boolean;
}

export function UsersList() {
  const { toast } = useToast();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Primeiro, verificar se o usuário atual é um admin do SafeLogin
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return profile;
    },
  });

  // Buscar usuários com base no tipo de usuário (admin ou não)
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users", currentUser?.is_safelogin_admin],
    queryFn: async () => {
      if (!currentUser) return [];

      if (currentUser.is_safelogin_admin) {
        // Se for admin do SafeLogin, buscar todos os usuários
        const { data: allUsers, error } = await supabase
          .from("profiles")
          .select("*");

        if (error) throw error;
        return allUsers as User[];
      } else {
        // Se não for admin, buscar apenas usuários da mesma empresa
        const { data: companyUsers, error } = await supabase
          .from("company_users")
          .select(`
            user_id,
            role,
            profiles:user_id (
              id,
              full_name,
              email,
              avatar_url,
              is_safelogin_admin
            )
          `)
          .eq("company_id", currentUser.company_id);

        if (error) throw error;

        return companyUsers.map((cu) => ({
          ...cu.profiles,
          role: cu.role,
        })) as User[];
      }
    },
    enabled: !!currentUser,
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      setDeletingUserId(userId);
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuários</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>
                    {user.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                {user.full_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role || "N/A"}</TableCell>
              <TableCell>
                {user.is_safelogin_admin ? "Admin SafeLogin" : "Usuário"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Confirmar exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deletingUserId === user.id}
                        >
                          {deletingUserId === user.id && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}