import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";

interface CredentialUserGroupProps {
  username: string;
  userIndex: number;
  onCopy: (text: string) => void;
  onRemove: (userIndex: number) => void;
}

export const CredentialUserGroup = ({
  username,
  userIndex,
  onCopy,
  onRemove
}: CredentialUserGroupProps) => {
  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-500">Usuário {userIndex + 1}</label>
      <div className="flex items-center gap-2 break-all">
        <span className="text-sm flex-grow">{username}</span>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCopy(username)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(userIndex)}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};