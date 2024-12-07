import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Edit2 } from "lucide-react";
import { useState } from "react";

interface AccessCredential {
  type: string;
  value: string;
  username?: string;
  password?: string;
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