import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FileViewerDialog } from "./FileViewerDialog";
import { CredentialHeader } from "./credential-card/CredentialHeader";
import { CredentialContent } from "./credential-card/CredentialContent";

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface UserCredential {
  username?: string;
  password?: string;
}

interface AccessCredential {
  type: string;
  value: string;
  userCredentials: UserCredential[];
  priority?: number;
}

interface CredentialCardProps {
  title: string;
  cardType: string;
  manufacturerId?: string;
  credentials: AccessCredential[];
  files?: AttachedFile[];
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onAddFile?: (file: File) => void;
  onRemoveFile?: (fileId: string) => void;
  onRenameFile?: (fileId: string, newName: string) => void;
  isTrash?: boolean;
  flags?: string[];
  onFlagChange?: (flags: string[]) => void;
}

export const CredentialCard = ({
  title,
  cardType,
  manufacturerId,
  credentials,
  files = [],
  onEdit,
  onDelete,
  onRestore,
  onAddFile,
  onRemoveFile,
  onRenameFile,
  isTrash = false,
  flags = [],
  onFlagChange,
}: CredentialCardProps) => {
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [localCredentials, setLocalCredentials] = useState<AccessCredential[]>(credentials);
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copiado para a área de transferência",
      duration: 3000,
    });
  };

  const togglePassword = (credIndex: number, userIndex: number) => {
    const key = `${credIndex}-${userIndex}`;
    setShowPasswords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const removeField = (credentialIndex: number, fieldName: string, userIndex?: number) => {
    setLocalCredentials(prevCreds => 
      prevCreds.map((cred, idx) => {
        if (idx === credentialIndex) {
          if (fieldName === 'userCredentials' && userIndex !== undefined) {
            return {
              ...cred,
              userCredentials: cred.userCredentials.filter((_, i) => i !== userIndex)
            };
          }
          const newCred = { ...cred };
          delete newCred[fieldName as keyof AccessCredential];
          return newCred;
        }
        return cred;
      })
    );
    
    toast({
      description: "Campo removido com sucesso",
      duration: 3000,
    });
  };

  const handleGeneratedPassword = (credIndex: number, userIndex: number, newPassword: string) => {
    setLocalCredentials(prevCreds => 
      prevCreds.map((cred, idx) => {
        if (idx === credIndex) {
          const newUserCreds = [...cred.userCredentials];
          if (newUserCreds[userIndex]) {
            newUserCreds[userIndex] = {
              ...newUserCreds[userIndex],
              password: newPassword
            };
          }
          return {
            ...cred,
            userCredentials: newUserCreds
          };
        }
        return cred;
      })
    );

    toast({
      description: "Nova senha gerada com sucesso!",
      duration: 3000,
    });
  };

  return (
    <Card className="w-auto min-w-[300px] max-w-full hover:shadow-lg transition-shadow">
      <CredentialHeader
        title={title}
        cardType={cardType}
        manufacturerId={manufacturerId}
        files={files}
        isTrash={isTrash}
        flags={flags}
        onFlagChange={onFlagChange}
        onEdit={onEdit}
        onDelete={onDelete}
        onRestore={onRestore}
        onFileViewerOpen={() => setIsFileViewerOpen(true)}
      />
      
      <CredentialContent
        cardType={cardType}
        credentials={localCredentials}
        showPasswords={showPasswords}
        onTogglePassword={togglePassword}
        onCopyToClipboard={copyToClipboard}
        onRemoveField={removeField}
        onGeneratePassword={handleGeneratedPassword}
      />
      
      {!isTrash && onAddFile && onRemoveFile && onRenameFile && (
        <FileViewerDialog
          isOpen={isFileViewerOpen}
          onClose={() => setIsFileViewerOpen(false)}
          files={files}
          credentialTitle={title}
          onAddFile={onAddFile}
          onRemoveFile={onRemoveFile}
          onRenameFile={onRenameFile}
        />
      )}
    </Card>
  );
};