import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { CredentialCard } from "@/components/CredentialCard";

// Dados de exemplo - serão removidos após integração com Supabase
const mockCredentials = [
  {
    id: 1,
    title: "Gmail Trabalho",
    credentials: [
      {
        type: "URL",
        value: "https://gmail.com",
        username: "usuario@empresa.com",
        password: "senha123",
      },
      {
        type: "URL",
        value: "https://mail.google.com",
        username: "usuario@empresa.com",
        password: "senha123",
      },
    ],
  },
  {
    id: 2,
    title: "Sistema Interno",
    credentials: [
      {
        type: "URL",
        value: "https://sistema.empresa.com",
        username: "admin",
        password: "admin123",
      },
      {
        type: "SSH",
        value: "192.168.1.100",
        username: "root",
        password: "root123",
      },
      {
        type: "API",
        value: "https://api.sistema.empresa.com",
        username: "apikey",
        password: "chave-secreta-123",
      },
    ],
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
              credentials={credential.credentials}
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