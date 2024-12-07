import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { CredentialCard } from "@/components/CredentialCard";

// Dados de exemplo - serão removidos após integração com Supabase
const mockCredentials = [
  {
    id: 1,
    title: "Gmail Trabalho",
    url: "https://gmail.com",
    username: "usuario@empresa.com",
    password: "senha123",
  },
  {
    id: 2,
    title: "Sistema Interno",
    url: "https://sistema.empresa.com",
    username: "admin",
    password: "admin123",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Minhas Credenciais</h1>
          <AddCredentialDialog />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mockCredentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              title={credential.title}
              url={credential.url}
              username={credential.username}
              password={credential.password}
              onEdit={() => {
                // Será implementado após integração com Supabase
                console.log("Edit credential:", credential.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;