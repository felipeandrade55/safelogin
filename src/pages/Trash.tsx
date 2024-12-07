import { useState } from "react";
import { CredentialCard } from "@/components/CredentialCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  getTrashCredentials, 
  restoreFromTrash, 
  clearExpiredTrash 
} from "@/utils/trashUtils";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TrashCredential {
  type: string;
  value: string;
  username?: string;
  password?: string;
  emailServer?: string;
  emailPort?: string;
  emailDescription?: string;
  userCredentials?: Array<{
    username?: string;
    password?: string;
  }>;
}

const Trash = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const trashedCredentials = getTrashCredentials();

  const handleRestore = (credentialId: string, companyId: string) => {
    restoreFromTrash(credentialId, companyId);
    toast({
      title: "Credencial Restaurada",
      description: "A credencial foi restaurada com sucesso.",
    });
  };

  const filteredCredentials = trashedCredentials.filter((cred) =>
    cred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.credentials.some(
      (c) =>
        c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const transformCredentials = (credentials: TrashCredential[]) => {
    return credentials.map(cred => ({
      ...cred,
      userCredentials: cred.userCredentials || [{
        username: cred.username || "",
        password: cred.password || ""
      }]
    }));
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-primary">Lixeira</h1>
          </div>
          <Button variant="outline" onClick={() => clearExpiredTrash()}>
            Limpar Itens Expirados
          </Button>
        </div>

        <Input
          type="search"
          placeholder="Pesquisar credenciais na lixeira..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCredentials.map((credential) => (
              <CredentialCard
                key={credential.id}
                title={`${credential.title} (${credential.companyName})`}
                credentials={transformCredentials(credential.credentials)}
                onRestore={() => handleRestore(credential.id, credential.companyId)}
                isTrash={true}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Trash;