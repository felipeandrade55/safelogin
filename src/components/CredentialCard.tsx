import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Edit2, Trash2, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AccessCredential {
  type: string;
  value: string;
  username?: string;
  password?: string;
  emailServer?: string;
  emailPort?: string;
  emailDescription?: string;
}

interface CredentialCardProps {
  title: string;
  credentials: AccessCredential[];
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  isTrash?: boolean;
}

export const CredentialCard = ({
  title,
  credentials,
  onEdit,
  onDelete,
  onRestore,
  isTrash = false,
}: CredentialCardProps) => {
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [localCredentials, setLocalCredentials] = useState<AccessCredential[]>(credentials);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copiado para a área de transferência",
    });
  };

  const togglePassword = (index: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const removeField = (credentialIndex: number, fieldName: keyof AccessCredential) => {
    setLocalCredentials(prevCreds => 
      prevCreds.map((cred, idx) => {
        if (idx === credentialIndex) {
          const newCred = { ...cred };
          delete newCred[fieldName];
          return newCred;
        }
        return cred;
      })
    );
    
    toast({
      description: "Campo removido com sucesso",
    });
  };

  const renderField = (
    credentialIndex: number,
    label: string,
    value: string | undefined,
    fieldName: keyof AccessCredential,
    isPassword = false
  ) => {
    if (!value) return null;

    return (
      <div className="relative">
        <label className="text-sm font-medium text-gray-500">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {isPassword ? (showPasswords[credentialIndex] ? value : "••••••••") : value}
          </span>
          <div className="flex items-center gap-1">
            {isPassword && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePassword(credentialIndex)}
              >
                {showPasswords[credentialIndex] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(value)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeField(credentialIndex, fieldName)}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {isTrash ? (
            <Button variant="ghost" size="icon" onClick={onRestore}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {localCredentials.map((cred, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              {renderField(index, cred.type, cred.value, "value")}
              {renderField(index, "Usuário", cred.username, "username")}
              {renderField(index, "Senha", cred.password, "password", true)}
              
              {cred.type === "Email" && (
                <>
                  {renderField(index, "Servidor SMTP", cred.emailServer, "emailServer")}
                  {renderField(index, "Porta SMTP", cred.emailPort, "emailPort")}
                  {renderField(index, "Descrição", cred.emailDescription, "emailDescription")}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};