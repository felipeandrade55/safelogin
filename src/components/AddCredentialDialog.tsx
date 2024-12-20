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
import { Plus, PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopManager } from "./PopManager";
import { ManufacturerManager } from "./ManufacturerManager";
import { AccessCredentialGroup } from "./AccessCredentialGroup";
import { useCredentials } from "@/hooks/useCredentials";
import { useToast } from "@/hooks/use-toast";

interface AccessCredential {
  type: string;
  value: string;
  userCredentials: Array<{
    username?: string;
    password?: string;
  }>;
  priority?: number;
}

interface AddCredentialDialogProps {
  companyId: string;
}

export const AddCredentialDialog = ({ companyId }: AddCredentialDialogProps) => {
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState<AccessCredential[]>([
    { 
      type: "URL", 
      value: "", 
      userCredentials: [{ username: "", password: "" }],
      priority: 1 
    },
  ]);
  const [title, setTitle] = useState("");
  const [cardType, setCardType] = useState("Infraestrutura");
  const [noteContent, setNoteContent] = useState("");
  const [selectedPop, setSelectedPop] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");

  const { addCredential } = useCredentials(companyId);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Ordena as credenciais por prioridade antes de salvar
      const sortedCredentials = [...credentials].sort((a, b) => 
        (a.priority || 1) - (b.priority || 1)
      );

      await addCredential.mutateAsync({
        credential: {
          company_id: companyId,
          title,
          card_type: cardType,
          manufacturer_id: selectedManufacturer || undefined,
        },
        accessCredentials: sortedCredentials,
      });

      toast({
        title: "Sucesso",
        description: "Credencial adicionada com sucesso!",
      });

      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar credencial:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a credencial. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setCardType("Infraestrutura");
    setNoteContent("");
    setSelectedPop("");
    setSelectedManufacturer("");
    setCredentials([
      { 
        type: "URL", 
        value: "", 
        userCredentials: [{ username: "", password: "" }],
        priority: 1 
      },
    ]);
  };

  const addCredential = () => {
    if (cardType !== "Anotação") {
      const nextPriority = credentials.length + 1;
      setCredentials([
        ...credentials,
        { 
          type: "URL", 
          value: "", 
          userCredentials: [{ username: "", password: "" }],
          priority: nextPriority 
        },
      ]);
    }
  };

  const removeCredential = (index: number) => {
    const newCredentials = credentials.filter((_, i) => i !== index);
    // Reajusta as prioridades após remover
    const updatedCredentials = newCredentials.map((cred, idx) => ({
      ...cred,
      priority: idx + 1
    }));
    setCredentials(updatedCredentials);
  };

  const updateCredential = (index: number, field: string, value: any) => {
    const newCredentials = [...credentials];
    
    // Lida com campos aninhados (ex: userCredentials.0.username)
    if (field.includes('.')) {
      const [parent, child, subfield] = field.split('.');
      if (!newCredentials[index][parent]) {
        newCredentials[index][parent] = [];
      }
      if (!newCredentials[index][parent][Number(child)]) {
        newCredentials[index][parent][Number(child)] = {};
      }
      newCredentials[index][parent][Number(child)][subfield] = value;
    } else {
      newCredentials[index] = { ...newCredentials[index], [field]: value };
    }
    
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
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Gmail Trabalho" 
              required 
            />
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
                <AccessCredentialGroup
                  key={index}
                  index={index}
                  credential={cred}
                  onUpdate={updateCredential}
                  onRemove={removeCredential}
                  isRemovable={credentials.length > 1}
                />
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