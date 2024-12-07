import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditCredentialForm } from "@/components/EditCredentialForm";
import { useState } from "react";

interface Credential {
  type: string;
  value: string;
  username?: string;
  password?: string;
}

interface CredentialGroup {
  title: string;
  credentials: Credential[];
}

interface CredentialPreviewDialogProps {
  credentials: CredentialGroup[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (credentials: CredentialGroup[]) => void;
}

export function CredentialPreviewDialog({
  credentials,
  isOpen,
  onClose,
  onConfirm,
}: CredentialPreviewDialogProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewCredentials, setPreviewCredentials] = useState<CredentialGroup[]>(credentials);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (values: CredentialGroup, index: number) => {
    const newCredentials = [...previewCredentials];
    newCredentials[index] = {
      title: values.title,
      credentials: values.credentials.map(cred => ({
        type: cred.type,
        value: cred.value,
        ...(cred.username && { username: cred.username }),
        ...(cred.password && { password: cred.password }),
      })),
    };
    setPreviewCredentials(newCredentials);
    setEditingIndex(null);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={() => {
        onClose();
        setEditingIndex(null);
      }}
    >
      <DialogContent className="max-w-3xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>Preview das Credenciais Extraídas</DialogTitle>
          <DialogDescription>
            Revise as credenciais extraídas antes de adicioná-las ao workspace
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6">
            {previewCredentials && previewCredentials.length > 0 ? (
              previewCredentials.map((cred, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background">
                  {editingIndex === index ? (
                    <EditCredentialForm
                      initialData={{
                        title: cred.title,
                        credentials: cred.credentials,
                      }}
                      onSubmit={(values) => handleSaveEdit(values as CredentialGroup, index)}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{cred.title}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(index)}
                        >
                          Editar
                        </Button>
                      </div>
                      
                      {cred.credentials.map((access, accessIndex) => (
                        <div key={accessIndex} className="pl-4 border-l-2 border-muted">
                          <p className="font-medium">{access.type}</p>
                          <p className="text-sm text-muted-foreground break-all">{access.value}</p>
                          {access.username && (
                            <p className="text-sm">Usuário: {access.username}</p>
                          )}
                          {access.password && (
                            <p className="text-sm">Senha: •••••••</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma credencial foi extraída
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(previewCredentials)}>
            Confirmar e Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}