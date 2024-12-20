import { useState } from "react";
import { Loader2, Pencil, Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateUserForm } from "./CreateUserForm";

export function UsersList() {
  const navigate = useNavigate();
  const { users, isLoading, handleDeleteUser, currentUser } = useUserManagement();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const handleDeleteWithState = async (userId: string) => {
    setDeletingUserId(userId);
    await handleDeleteUser(userId);
    setDeletingUserId(null);
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
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              </DialogHeader>
              <CreateUserForm />
            </DialogContent>
          </Dialog>
          {currentUser?.is_safelogin_admin && (
            <Button onClick={() => navigate("/register-admin")}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Administrador
            </Button>
          )}
        </div>
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
                <UserAvatar
                  avatarUrl={user.avatar_url}
                  fullName={user.full_name}
                />
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
                  <DeleteUserDialog
                    userId={user.id}
                    isDeleting={deletingUserId === user.id}
                    onDelete={handleDeleteWithState}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}