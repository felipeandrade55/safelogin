import { CredentialCard } from "@/components/CredentialCard";
import { Badge } from "@/components/ui/badge";

interface CredentialGroupProps {
  title: string;
  credentials: any[];
  companyId: string;
  onEdit?: (credential: any) => void;
  onDelete?: (credential: any, companyId: string) => void;
  onAddFile?: (credentialId: string, file: File) => void;
  onRemoveFile?: (credentialId: string, fileId: string) => void;
  onRenameFile?: (credentialId: string, fileId: string, newName: string) => void;
  onFlagChange?: (credentialId: string, newFlags: string[]) => void;
}

export function CredentialGroup({
  title,
  credentials,
  companyId,
  onEdit,
  onDelete,
  onAddFile,
  onRemoveFile,
  onRenameFile,
  onFlagChange,
}: CredentialGroupProps) {
  if (credentials.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
        <Badge variant="outline" className="text-lg font-semibold px-3 py-1">
          {title}
        </Badge>
        <span className="text-sm text-muted-foreground">
          ({credentials.length} {credentials.length === 1 ? 'item' : 'itens'})
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {credentials.map((credential) => (
          <CredentialCard
            key={credential.id}
            title={credential.title}
            cardType={credential.cardType}
            credentials={credential.credentials}
            files={credential.files}
            flags={credential.flags || []}
            onFlagChange={(newFlags) => onFlagChange?.(credential.id, newFlags)}
            onEdit={() => onEdit?.(credential)}
            onDelete={() => onDelete?.(credential, companyId)}
            onAddFile={(file) => onAddFile?.(credential.id, file)}
            onRemoveFile={(fileId) => onRemoveFile?.(credential.id, fileId)}
            onRenameFile={(fileId, newName) => onRenameFile?.(credential.id, fileId, newName)}
          />
        ))}
      </div>
    </div>
  );
}