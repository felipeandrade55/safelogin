import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Edit2, Trash2, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UserCredential {
  username?: string;
  password?: string;
}

interface AccessCredential {
  type: string;
  value: string;
  userCredentials: UserCredential[];
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
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>(
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

  const togglePassword = (credIndex: number, userIndex: number) => {
    const key = `${credIndex}-${userIndex}`;
    setShowPasswords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const removeField = (credentialIndex: number, fieldName: keyof AccessCredential | 'userCredentials', userIndex?: number) => {
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
          {localCredentials.map((cred, credIndex) => (
            <div key={credIndex} className="space-y-4 p-4 border rounded-lg">
              <div className="relative">
                <label className="text-sm font-medium text-gray-500">{cred.type}</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cred.value}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(cred.value)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(credIndex, "value")}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {cred.userCredentials?.map((userCred, userIndex) => (
                <div key={userIndex} className="pl-4 border-l-2 border-muted space-y-2">
                  {userCred.username && (
                    <div className="relative">
                      <label className="text-sm font-medium text-gray-500">Usuário {userIndex + 1}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{userCred.username}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(userCred.username!)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeField(credIndex, 'userCredentials', userIndex)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {userCred.password && (
                    <div className="relative">
                      <label className="text-sm font-medium text-gray-500">Senha {userIndex + 1}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {showPasswords[`${credIndex}-${userIndex}`] ? userCred.password : "••••••••"}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePassword(credIndex, userIndex)}
                          >
                            {showPasswords[`${credIndex}-${userIndex}`] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(userCred.password!)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeField(credIndex, 'userCredentials', userIndex)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};