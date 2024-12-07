import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Edit2 } from "lucide-react";
import { useState } from "react";

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
  onEdit: () => void;
}

export const CredentialCard = ({
  title,
  credentials,
  onEdit,
}: CredentialCardProps) => {
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>(
    {}
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePassword = (index: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {credentials.map((cred, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  {cred.type}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cred.value}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(cred.value)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {cred.type === "Email" && (
                <>
                  {cred.emailServer && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Servidor SMTP
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{cred.emailServer}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(cred.emailServer || "")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {cred.emailPort && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Porta SMTP
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{cred.emailPort}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(cred.emailPort || "")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {cred.emailDescription && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Descrição
                      </label>
                      <p className="text-sm mt-1 text-gray-600">
                        {cred.emailDescription}
                      </p>
                    </div>
                  )}
                </>
              )}

              {cred.username && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Usuário
                  </label>
                  <div className="flex items-center gap-2">
                    <span>{cred.username}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(cred.username || "")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {cred.password && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Senha
                  </label>
                  <div className="flex items-center gap-2">
                    <span>
                      {showPasswords[index] ? cred.password : "••••••••"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePassword(index)}
                    >
                      {showPasswords[index] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(cred.password || "")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};