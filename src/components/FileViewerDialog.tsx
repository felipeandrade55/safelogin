import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileAttachment } from "./FileAttachment";

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  files: AttachedFile[];
  credentialTitle: string;
  onAddFile?: (file: File) => void;
  onRemoveFile?: (fileId: string) => void;
  onRenameFile?: (fileId: string, newName: string) => void;
}

export function FileViewerDialog({
  isOpen,
  onClose,
  files,
  credentialTitle,
  onAddFile,
  onRemoveFile,
  onRenameFile,
}: FileViewerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Left side - Preview */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Visualização do Arquivo</h3>
            <div className="h-[calc(100%-2rem)] bg-secondary rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Selecione um arquivo para visualizar</p>
            </div>
          </div>

          {/* Right side - File list */}
          <ScrollArea className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Arquivos de {credentialTitle}</h3>
            <FileAttachment
              files={files}
              onAddFile={onAddFile}
              onRemoveFile={onRemoveFile}
              onRenameFile={onRenameFile}
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}