import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopManager } from "./PopManager";
import { ManufacturerManager } from "./ManufacturerManager"; // Import the ManufacturerManager

interface AccessCredential {
  type: string;
  value: string;
  username?: string;
  password?: string;
  emailServer?: string;
  emailPort?: string;
  emailDescription?: string;
  noteContent?: string;
  popId?: string;
  manufacturerId?: string; // Add manufacturerId to the interface
}

export const AddCredentialDialog = () => {
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState<AccessCredential[]>([
    { type: "URL", value: "", username: "", password: "" },
  ]);
  const [cardType, setCardType] = useState("Equipamento");
  const [noteContent, setNoteContent] = useState("");
  const [selectedPop, setSelectedPop] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState(""); // State for selected manufacturer

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Será implementado após integração com Supabase
    if (cardType === "Anotação") {
      // For note type, we create a single credential with the note content
      setCredentials([{ type: "NOTE", value: noteContent }]);
    }
    setOpen(false);
  };

  const addCredential = () => {
    if (cardType !== "Anotação") {
      setCredentials([
        ...credentials,
        { type: "URL", value: "", username: "", password: "", manufacturerId: selectedManufacturer }, // Include manufacturerId
      ]);
    }
  };

  const removeCredential = (index: number) => {
    setCredentials(credentials.filter((_, i) => i !== index));
  };

  const updateCredential = (
    index: number,
    field: keyof AccessCredential,
    value: string
  ) => {
    const newCredentials = [...credentials];
    newCredentials[index] = { ...newCredentials[index], [field]: value };
    setCredentials(newCredentials);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar Credencial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Credencial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ex: Gmail Trabalho" required />
          </div>

          <div className="space-y-2">
            <Label>Grupo</Label>
            <Select value={cardType} onValueChange={setCardType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Infraestrutura",
                  "Servidores",
                  "Rede",
                  "Aplicações",
                  "Banco de Dados",
                  "Cloud",
                  "Desenvolvimento",
                  "Monitoramento",
                  "Outros",
                ].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {cardType !== "Anotação" && cardType !== "Site" && (
            <>
              <div className="space-y-2">
                <Label>Localização (POP)</Label>
                <PopManager
                  selectedPop={selectedPop}
                  onPopSelect={setSelectedPop}
                />
              </div>
              <div className="space-y-2">
                <Label>Fabricante</Label>
                <ManufacturerManager
                  selectedManufacturer={selectedManufacturer}
                  onManufacturerSelect={setSelectedManufacturer}
                />
              </div>
            </>
          )}

          {cardType === "Anotação" ? (
            <div className="space-y-2">
              <Label>Conteúdo da Anotação</Label>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Digite sua anotação aqui..."
                className="min-h-[200px] resize-y"
                maxLength={5000}
              />
              <p className="text-sm text-muted-foreground text-right">
                {noteContent.length}/5000 caracteres
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Credenciais de Acesso</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCredential}
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Adicionar Acesso
                </Button>
              </div>

              {credentials.map((cred, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeCredential(index)}
                    disabled={credentials.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>

                  <div className="space-y-2">
                    <Label>Tipo de Acesso</Label>
                    <Select
                      value={cred.type}
                      onValueChange={(value) =>
                        updateCredential(index, "type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "URL",
                          "IP",
                          "IPv6",
                          "API",
                          "FTP",
                          "SSH",
                          "SFTP",
                          "Telnet",
                          "Email",
                          "Outros",
                        ].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      {cred.type === "Email" ? "Endereço de Email" : "Endereço"}
                    </Label>
                    <Input
                      value={cred.value}
                      onChange={(e) =>
                        updateCredential(index, "value", e.target.value)
                      }
                      placeholder={
                        cred.type === "Email"
                          ? "exemplo@dominio.com"
                          : cred.type === "URL"
                          ? "https://..."
                          : cred.type === "IP"
                          ? "192.168.1.1"
                          : "Endereço de acesso"
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Usuário</Label>
                    <Input
                      value={cred.username}
                      onChange={(e) =>
                        updateCredential(index, "username", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      value={cred.password}
                      onChange={(e) =>
                        updateCredential(index, "password", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
