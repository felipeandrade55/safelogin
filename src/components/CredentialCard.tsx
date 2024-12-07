import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Edit2, Trash2, RotateCcw, X, FileText, Wand2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { FileViewerDialog } from "./FileViewerDialog";
import { FlagSelector } from "./FlagSelector";
import { loadFlags } from "@/utils/flagsData";
import { loadManufacturers } from "@/utils/manufacturerData";
import { PasswordGeneratorDialog } from "./PasswordGeneratorDialog";

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

const getPriorityLabel = (priority: number) => {
  const labels: { [key: number]: string } = {
    1: "Preferencial",
    2: "Secundário",
    3: "Terciário",
    4: "Quaternário",
    5: "Quinário"
  };
  return labels[priority] || `Prioridade ${priority}`;
};

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
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>(
    {}
  );
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

  const handleFlagToggle = (flagId: string) => {
    if (!onFlagChange) return;
    
    const newFlags = flags.includes(flagId)
      ? flags.filter(f => f !== flagId)
      : [...flags, flagId];
    
    onFlagChange(newFlags);
  };

  const manufacturer = manufacturerId ? loadManufacturers().find(m => m.id === manufacturerId) : null;

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
  };

  return (
    <Card className="w-auto min-w-[300px] max-w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-bold truncate">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={`${getCardTypeColor(cardType)} text-white`}>
              {cardType}
            </Badge>
            {manufacturer && (
              <Badge variant="outline">
                {manufacturer.name}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isTrash && onFlagChange && (
            <FlagSelector
              selectedFlags={flags}
              onFlagToggle={handleFlagToggle}
            />
          )}
          {!isTrash && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsFileViewerOpen(true)}
              className="relative"
            >
              <FileText className="h-4 w-4" />
              {files.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  {files.length}
                </Badge>
              )}
            </Button>
          )}
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
          {cardType === "Anotação" ? (
            <div className="space-y-2">
              {localCredentials.map((cred) => (
                <div key={cred.value} className="prose max-w-none">
                  <p className="whitespace-pre-wrap break-words">{cred.value}</p>
                </div>
              ))}
            </div>
          ) : (
            localCredentials.map((cred, credIndex) => (
              <div key={credIndex} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">
                    {getPriorityLabel(cred.priority || 1)}
                  </Badge>
                  <Badge>{cred.type}</Badge>
                </div>
                
                <div className="relative">
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
                            <PasswordGeneratorDialog 
                              onPasswordGenerated={(newPassword) => 
                                handleGeneratedPassword(credIndex, userIndex, newPassword)
                              }
                            />
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
            ))
          )}
          
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
        </div>
      </CardContent>
    </Card>
  );
};
