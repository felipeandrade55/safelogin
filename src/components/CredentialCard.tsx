import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Edit2, Trash2, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { FileAttachment } from "./FileAttachment";

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
}

interface CredentialCardProps {
  title: string;
  cardType: string;
  credentials: AccessCredential[];
  files?: AttachedFile[];
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onAddFile?: (file: File) => void;
  onRemoveFile?: (fileId: string) => void;
  onRenameFile?: (fileId: string, newName: string) => void;
  isTrash?: boolean;
}

const getCardTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'Equipamento': 'bg-blue-500',
    'Servidor': 'bg-green-500',
    'Roteador': 'bg-yellow-500',
    'Switch': 'bg-purple-500',
    'Rádio': 'bg-orange-500',
    'OLT': 'bg-red-500',
    'Site': 'bg-indigo-500',
    'Outros': 'bg-gray-500'
  };
  return colors[type] || colors['Outros'];
};

export const CredentialCard = ({
  title,
  cardType,
  credentials,
  files = [],
  onEdit,
  onDelete,
  onRestore,
  onAddFile,
  onRemoveFile,
  onRenameFile,
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
      duration: 3000,
    });
  };

  return (
    <Card className="w-auto min-w-[300px] max-w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold truncate">{title}</CardTitle>
          <Badge className={`${getCardTypeColor(cardType)} text-white`}>
            {cardType}
          </Badge>
        </div>
        <div className="flex items-center gap-2 shrink-0">
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
        <div className="space-y-4">
          {localCredentials.map((cred, credIndex) => (
            <div key={credIndex} className="space-y-3 p-3 border rounded-lg">
              <div className="relative">
                <label className="text-sm font-medium text-gray-500">{cred.type}</label>
                <div className="flex items-center gap-2 break-all">
                  <span className="text-sm flex-grow">{cred.value}</span>
                  <div className="flex items-center gap-1 shrink-0">
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
                <div key={userIndex} className="pl-3 border-l-2 border-muted space-y-2">
                  {userCred.username && (
                    <div className="relative">
                      <label className="text-sm font-medium text-gray-500">Usuário {userIndex + 1}</label>
                      <div className="flex items-center gap-2 break-all">
                        <span className="text-sm flex-grow">{userCred.username}</span>
                        <div className="flex items-center gap-1 shrink-0">
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
                      <div className="flex items-center gap-2 break-all">
                        <span className="text-sm flex-grow">
                          {showPasswords[`${credIndex}-${userIndex}`] ? userCred.password : "••••••••"}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
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
          
          {!isTrash && onAddFile && onRemoveFile && onRenameFile && (
            <FileAttachment
              files={files}
              onAddFile={onAddFile}
              onRemoveFile={onRemoveFile}
              onRenameFile={onRenameFile}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
