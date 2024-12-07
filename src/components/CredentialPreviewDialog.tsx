import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditCredentialForm } from "@/components/EditCredentialForm";
import { useState } from "react";

interface CredentialPreviewDialogProps {
  credentials: Array<{
    title: string;
    credentials: Array<{
      type: string;
      value: string;
      username?: string;
      password?: string;
    }>;
  }>;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (credentials: Array<{
    title: string;
    credentials: Array<{
      type: string;
      value: string;
      username?: string;
      password?: string;
    }>;
  }>) => void;
}

export function CredentialPreviewDialog({
  credentials,
  isOpen,
  onClose,
  onConfirm,
}: CredentialPreviewDialogProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewCredentials, setPreviewCredentials] = useState(credentials);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (values: typeof credentials[0], index: number) => {
    const newCredentials = [...previewCredentials];
    newCredentials[index] = values;
    setPreviewCredentials(newCredentials);
    setEditingIndex(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      onClose();
      setEditingIndex(null);
    }}>
      <DialogContent className="max-w-3xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>Preview das Credenciais Extraídas</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6">
            {previewCredentials.map((cred, index) => (
              <div key={index} className="p-4 border rounded-lg">
                {editingIndex === index ? (
                  <EditCredentialForm
                    initialData={cred}
                    onSubmit={(values) => handleSaveEdit(values, index)}
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
                      <div key={accessIndex} className="pl-4 border-l-2">
                        <p className="font-medium">{access.type}</p>
                        <p className="text-sm text-muted-foreground">{access.value}</p>
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
            ))}
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
  </div>