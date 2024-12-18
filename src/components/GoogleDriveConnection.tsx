import { useState, useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadCard } from "./FileUploadCard";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from "lucide-react";

interface GoogleDriveConnectionProps {
  onFileUploaded?: (fileUrl: string) => void;
}

export function GoogleDriveConnection({ onFileUploaded }: GoogleDriveConnectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        // Aqui você pode armazenar o token de acesso no localStorage ou em um estado global
        localStorage.setItem('googleAccessToken', tokenResponse.access_token);
        setIsAuthenticated(true);
        toast({
          title: "Conectado com sucesso",
          description: "Você está conectado ao Google Drive",
        });
      } catch (error) {
        console.error('Erro ao autenticar:', error);
        toast({
          title: "Erro ao conectar",
          description: "Não foi possível conectar ao Google Drive",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível conectar ao Google Drive",
        variant: "destructive",
      });
    },
    scope: 'https://www.googleapis.com/auth/drive.file',
  });

  const uploadToGoogleDrive = useCallback(async (file: File) => {
    const accessToken = localStorage.getItem('googleAccessToken');
    if (!accessToken) {
      toast({
        title: "Erro",
        description: "Você precisa estar conectado ao Google Drive",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Criar um formulário com o arquivo
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify({
        name: file.name,
        mimeType: file.type,
      })], { type: 'application/json' }));
      form.append('file', file);

      // Upload para o Google Drive
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload do arquivo');
      }

      const data = await response.json();
      
      if (onFileUploaded) {
        onFileUploaded(`https://drive.google.com/file/d/${data.id}/view`);
      }

      toast({
        title: "Sucesso",
        description: "Arquivo enviado para o Google Drive",
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar o arquivo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onFileUploaded, toast]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google Drive</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAuthenticated ? (
          <Button
            onClick={() => login()}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <LogIn className="h-4 w-4 mr-2" />
            )}
            Conectar ao Google Drive
          </Button>
        ) : (
          <div className="space-y-4">
            <FileUploadCard
              onCredentialsGenerated={(files) => {
                // Aqui você pode implementar a lógica para upload de múltiplos arquivos
                console.log('Arquivos para upload:', files);
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}