import { MainNav } from "@/components/MainNav";
import { UserProfileForm } from "@/components/settings/UserProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <MainNav />
        </div>
      </div>
      <div className="container py-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Configurações</h1>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserProfileForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}