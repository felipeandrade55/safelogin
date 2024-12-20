import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditCredentialForm } from "@/components/EditCredentialForm";

interface EditCredentialDialogProps {
  credential: any | null;
  onClose: () => void;
  onSubmit: (updatedData: any) => Promise<void>;
}

export const EditCredentialDialog = ({
  credential,
  onClose,
  onSubmit
}: EditCredentialDialogProps) => {
  if (!credential) return null;

  return (
    <Dialog open={!!credential} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Editar Credencial</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-1">
          <EditCredentialForm
            initialData={credential}
            onSubmit={onSubmit}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};