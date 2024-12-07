import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Pencil, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileAttachmentProps {
  files: AttachedFile[];
  onAddFile: (file: File) => void;
  onRemoveFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
}

export const FileAttachment = ({
  files,
  onAddFile,
  onRemoveFile,
  onRenameFile,
}: FileAttachmentProps) => {
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAddFile(file);
    }
  };

  const handleRename = (fileId: string) => {
    if (newFileName.trim()) {
      onRenameFile(fileId, newFileName);
      setEditingFileId(null);
      setNewFileName("");
      toast({
        description: "Arquivo renomeado com sucesso",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Arquivos Anexados</h3>
        <div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Plus className="h-4 w-4" />
            Anexar Arquivo
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2 border rounded-lg bg-background"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              {editingFileId === file.id ? (
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleRename(file.id)}
                  className="h-7"
                  autoFocus
                />
              ) : (
                <span className="text-sm truncate">{file.name}</span>
              )}
              <span className="text-xs text-muted-foreground">
                ({formatFileSize(file.size)})
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {editingFileId === file.id ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRename(file.id)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingFileId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingFileId(file.id);
                      setNewFileName(file.name);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFile(file.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};