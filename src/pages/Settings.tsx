import { UserProfileForm } from "@/components/settings/UserProfileForm";
import { UsersList } from "@/components/settings/UsersList";
import { CreateAdminForm } from "@/components/settings/CreateAdminForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserManagement } from "@/hooks/useUserManagement";

export function Settings() {
  const { currentUser } = useUserManagement();

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          {currentUser?.is_safelogin_admin && (
            <TabsTrigger value="create-admin">Criar Admin</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Perfil</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie suas informações pessoais e foto de perfil.
            </p>
          </div>
          <UserProfileForm />
        </TabsContent>
        <TabsContent value="users">
          <UsersList />
        </TabsContent>
        {currentUser?.is_safelogin_admin && (
          <TabsContent value="create-admin" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Criar Administrador SafeLogin</h3>
              <p className="text-sm text-muted-foreground">
                Crie novos administradores do sistema SafeLogin.
              </p>
            </div>
            <CreateAdminForm />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}