import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, X, MessageSquarePlus } from "lucide-react";
import { CredentialUserGroup } from "./CredentialUserGroup";
import { CredentialPasswordGroup } from "./CredentialPasswordGroup";
import { useState } from "react";

interface UserCredential {
  username?: string;
  password?: string;
}

interface AccessCredential {
  type: string;
  value: string;
  userCredentials: UserCredential[];
  priority?: number;
  comments?: string[];
}

interface CredentialContentProps {
  cardType: string;
  credentials: AccessCredential[];
  showPasswords: { [key: string]: boolean };
  onTogglePassword: (credIndex: number, userIndex: number) => void;
  onCopyToClipboard: (text: string) => void;
  onRemoveField: (credentialIndex: number, fieldName: string, userIndex?: number) => void;
  onGeneratePassword: (credIndex: number, userIndex: number, newPassword: string) => void;
  onAddComment?: (credIndex: number, comment: string) => void;
}

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

export const CredentialContent = ({
  cardType,
  credentials,
  showPasswords,
  onTogglePassword,
  onCopyToClipboard,
  onRemoveField,
  onGeneratePassword,
  onAddComment
}: CredentialContentProps) => {
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});

  const handleAddComment = (credIndex: number) => {
    if (newComments[credIndex]?.trim() && onAddComment) {
      onAddComment(credIndex, newComments[credIndex]);
      setNewComments(prev => ({ ...prev, [credIndex]: "" }));
    }
  };

  return (
    <CardContent>
      <div className="space-y-4">
        {cardType === "Anotação" ? (
          <div className="space-y-2">
            {credentials.map((cred) => (
              <div key={cred.value} className="prose max-w-none">
                <p className="whitespace-pre-wrap break-words">{cred.value}</p>
              </div>
            ))}
          </div>
        ) : (
          credentials.map((cred, credIndex) => (
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
                      onClick={() => onCopyToClipboard(cred.value)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveField(credIndex, "value")}
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
                    <CredentialUserGroup
                      username={userCred.username}
                      userIndex={userIndex}
                      onCopy={onCopyToClipboard}
                      onRemove={(idx) => onRemoveField(credIndex, 'userCredentials', idx)}
                    />
                  )}
                  
                  {userCred.password && (
                    <CredentialPasswordGroup
                      password={userCred.password}
                      userIndex={userIndex}
                      showPassword={showPasswords[`${credIndex}-${userIndex}`]}
                      onTogglePassword={() => onTogglePassword(credIndex, userIndex)}
                      onCopy={onCopyToClipboard}
                      onRemove={(idx) => onRemoveField(credIndex, 'userCredentials', idx)}
                      onPasswordGenerated={(newPassword) => onGeneratePassword(credIndex, userIndex, newPassword)}
                    />
                  )}
                </div>
              ))}

              {/* Seção de Comentários */}
              <div className="mt-4 pt-4 border-t">
                <div className="space-y-2">
                  {cred.comments?.map((comment, index) => (
                    <div key={index} className="bg-muted p-2 rounded-lg text-sm">
                      {comment}
                    </div>
                  ))}
                  
                  {onAddComment && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Adicionar comentário..."
                        value={newComments[credIndex] || ""}
                        onChange={(e) => setNewComments(prev => ({
                          ...prev,
                          [credIndex]: e.target.value
                        }))}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddComment(credIndex);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAddComment(credIndex)}
                      >
                        <MessageSquarePlus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </CardContent>
  );
};