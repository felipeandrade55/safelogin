import { UserProfileForm } from "@/components/settings/UserProfileForm";
import { UsersList } from "@/components/settings/UsersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Settings() {
  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
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
      </Tabs>
    </div>
  );
}