import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Edit2 } from "lucide-react";
import { useState } from "react";

interface CredentialCardProps {
  title: string;
  urls: { label: string; url: string }[];
  username: string;
  password: string;
  onEdit: () => void;
}

export const CredentialCard = ({
  title,
  urls,
  username,
  password,
  onEdit,
}: CredentialCardProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">URLs de Acesso</label>
            <div className="space-y-2">
              {urls.map((urlItem, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{urlItem.label}:</span>
                  <a
                    href={urlItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {urlItem.url}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(urlItem.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Usuário</label>
            <div className="flex items-center gap-2">
              <span>{username}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(username)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Senha</label>
            <div className="flex items-center gap-2">
              <span>
                {showPassword ? password : "••••••••"}
              </span>
              <Button
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(password)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};