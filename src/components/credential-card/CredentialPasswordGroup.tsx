import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, X } from "lucide-react";
import { PasswordGeneratorDialog } from "../PasswordGeneratorDialog";

interface CredentialPasswordGroupProps {
  password: string;
  userIndex: number;
  showPassword: boolean;
  onTogglePassword: () => void;
  onCopy: (text: string) => void;
  onRemove: (userIndex: number) => void;
  onPasswordGenerated: (newPassword: string) => void;
}

export const CredentialPasswordGroup = ({
  password,
  userIndex,
  showPassword,
  onTogglePassword,
  onCopy,
  onRemove,
  onPasswordGenerated
}: CredentialPasswordGroupProps) => {
  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-500">Senha {userIndex + 1}</label>
      <div className="flex items-center gap-2 break-all">
        <span className="text-sm flex-grow">
          {showPassword ? password : "••••••••"}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <PasswordGeneratorDialog 
            onPasswordGenerated={onPasswordGenerated}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePassword}
            className="h-8 w-8"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCopy(password)}
            className="h-8 w-8"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(userIndex)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};