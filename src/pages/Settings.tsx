import { UserProfileForm } from "@/components/settings/UserProfileForm";

export function Settings() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Perfil</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie suas informações pessoais e foto de perfil.
          </p>
        </div>
        <UserProfileForm />
      </div>
    </div>
  );
}