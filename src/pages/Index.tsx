import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { CredentialCard } from "@/components/CredentialCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Dados de exemplo - serão removidos após integração com Supabase
const mockCredentials = [
  {
    id: "cred_01HNYG8J5N1X2P3Q4R5T6Y7Z8",
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
    id: "cred_01HNYGB2M3N4P5Q6R7S8T9U0V",
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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCredentials = mockCredentials.filter((credential) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      credential.title.toLowerCase().includes(searchLower) ||
      credential.credentials.some(
        (cred) =>
          cred.type.toLowerCase().includes(searchLower) ||
          cred.value.toLowerCase().includes(searchLower) ||
          (cred.username && cred.username.toLowerCase().includes(searchLower))
      )
    );
  });

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Minhas Credenciais</h1>
          <AddCredentialDialog />
        </div>

        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Pesquisar credenciais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredCredentials.map((credential) => (
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