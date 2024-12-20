import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, PlusCircle } from "lucide-react";
import { useState } from "react";
import { AccessCredentialGroup } from "./AccessCredentialGroup";
import { useCredentials } from "@/hooks/useCredentials";
import { useToast } from "@/hooks/use-toast";
import { CredentialFormFields } from "./credential-form/CredentialFormFields";
import { AccessCredential, Credential } from "@/types/credentials";

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

  const { addCredential: mutateCredential } = useCredentials(companyId);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const sortedCredentials = [...credentials].sort((a, b) => 
        (a.priority || 1) - (b.priority || 1)
      );

      await mutateCredential.mutateAsync({
        credential: {
          company_id: companyId,
          title,
          card_type: cardType,
          manufacturer_id: selectedManufacturer || undefined,
        } as Omit<Credential, "id">,
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

  const handleAddCredential = () => {
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
    const updatedCredentials = newCredentials.map((cred, idx) => ({
      ...cred,
      priority: idx + 1
    }));
    setCredentials(updatedCredentials);
  };

  const updateCredential = (index: number, field: string, value: any) => {
    const newCredentials = [...credentials];
    
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
          <CredentialFormFields
            title={title}
            setTitle={setTitle}
            cardType={cardType}
            setCardType={setCardType}
            noteContent={noteContent}
            setNoteContent={setNoteContent}
            selectedPop={selectedPop}
            setSelectedPop={setSelectedPop}
            selectedManufacturer={selectedManufacturer}
            setSelectedManufacturer={setSelectedManufacturer}
          />

          {cardType !== "Anotação" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Credenciais de Acesso</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCredential}
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