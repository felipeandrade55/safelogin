import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

interface AccessCredentialGroupProps {
  index: number;
  credential: {
    type: string;
    value: string;
    userCredentials: Array<{
      username?: string;
      password?: string;
    }>;
    priority?: number;
  };
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  isRemovable: boolean;
}

export const AccessCredentialGroup = ({
  index,
  credential,
  onUpdate,
  onRemove,
  isRemovable
}: AccessCredentialGroupProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copiado para a área de transferência",
    });
  };

  const priorityLabels = {
    1: "Preferencial",
    2: "Secundário",
    3: "Terciário",
    4: "Quaternário",
    5: "Quinário"
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg relative">
      {isRemovable && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prioridade</Label>
          <Select
            value={String(credential.priority || 1)}
            onValueChange={(value) => onUpdate(index, "priority", Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipo de Acesso</Label>
          <Select
            value={credential.type}
            onValueChange={(value) => onUpdate(index, "type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {[
                "URL",
                "IP",
                "IPv6",
                "SSH",
                "API",
                "FTP",
                "SFTP",
                "SMTP",
                "POP3",
                "IMAP",
                "Outro"
              ].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Endereço</Label>
        <div className="flex gap-2">
          <Input
            value={credential.value}
            onChange={(e) => onUpdate(index, "value", e.target.value)}
            placeholder={
              credential.type === "URL" ? "https://..." :
              credential.type === "IP" ? "192.168.1.1" :
              credential.type === "IPv6" ? "2001:0db8:85a3:0000:0000:8a2e:0370:7334" :
              "Endereço de acesso"
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(credential.value)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {credential.userCredentials.map((userCred, userIndex) => (
        <div key={userIndex} className="space-y-4">
          <div className="space-y-2">
            <Label>Usuário</Label>
            <Input
              value={userCred.username || ""}
              onChange={(e) =>
                onUpdate(index, `userCredentials.${userIndex}.username`, e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Senha</Label>
            <div className="flex gap-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={userCred.password || ""}
                onChange={(e) =>
                  onUpdate(index, `userCredentials.${userIndex}.password`, e.target.value)
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              {userCred.password && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(userCred.password!)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};