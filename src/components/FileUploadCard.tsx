import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { analyzeDocument } from "@/lib/openai";

export const FileUploadCard = ({ onCredentialsGenerated }: { 
  onCredentialsGenerated: (credentials: Array<{
    title: string;
    credentials: Array<{
      type: string;
      value: string;
      username?: string;
      password?: string;
    }>;
  }>) => void 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await readFileContent(file);
      const credentials = await analyzeDocument(text);
      onCredentialsGenerated(credentials);
      
      toast({
        title: "Análise concluída",
        description: "As credenciais foram extraídas com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o arquivo. Verifique as configurações da OpenAI.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      
      if (file.type === "text/plain") {
        reader.readAsText(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                file.type === "application/vnd.ms-excel") {
        // Para arquivos Excel, vamos ler como texto por enquanto
        reader.readAsText(file);
      }
    });
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Upload de Arquivo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <Button
            variant="outline"
            className="w-full h-32 border-dashed"
            disabled={isLoading}
          >
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="h-8 w-8 mb-2" />
              <span>{isLoading ? "Processando..." : "Clique para fazer upload"}</span>
              <input
                type="file"
                className="hidden"
                accept=".txt,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </label>
          </Button>
          <p className="text-sm text-gray-500">
            Formatos suportados: .txt, .xlsx, .xls
          </p>
        </div>
      </CardContent>
    </Card>
  );
};