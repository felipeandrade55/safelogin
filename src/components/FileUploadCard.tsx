import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { analyzeDocument } from "@/lib/openai";
import { CredentialPreviewDialog } from "./CredentialPreviewDialog";
import { UploadButton } from "./upload/UploadButton";
import { UploadProgress } from "./upload/UploadProgress";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [extractedCredentials, setExtractedCredentials] = useState<Array<{
    title: string;
    credentials: Array<{
      type: string;
      value: string;
      username?: string;
      password?: string;
    }>;
  }>>([]);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("File selected:", file);
    
    if (!file) {
      console.log("No file selected");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setAiProgress(0);

    try {
      console.log("Starting file upload simulation");
      const simulateProgress = () => {
        setUploadProgress((prev) => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      };
      const progressInterval = setInterval(simulateProgress, 200);

      console.log("Reading file content");
      const text = await readFileContent(file);
      console.log("File content read successfully:", text.substring(0, 100) + "...");
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setIsAnalyzing(true);
      
      // Simular progresso da análise da IA
      let currentProgress = 0;
      const aiProgressInterval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress <= 95) {
          setAiProgress(currentProgress);
        }
      }, 300);

      console.log("Starting AI analysis");
      const credentials = await analyzeDocument(text);
      console.log("AI analysis completed:", credentials);
      
      clearInterval(aiProgressInterval);
      setAiProgress(100);
      
      if (!credentials || !Array.isArray(credentials) || credentials.length === 0) {
        throw new Error("Nenhuma credencial foi encontrada no arquivo");
      }
      
      setExtractedCredentials(credentials);
      setShowPreview(true);
      
      toast({
        title: "Análise concluída",
        description: "As credenciais foram extraídas com sucesso! Por favor, revise-as antes de adicionar.",
      });
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível processar o arquivo. Verifique as configurações da OpenAI.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
      setUploadProgress(0);
      setAiProgress(0);
    }
  };

  const handleConfirmCredentials = (confirmedCredentials: typeof extractedCredentials) => {
    console.log("Confirming credentials:", confirmedCredentials);
    onCredentialsGenerated(confirmedCredentials);
    setShowPreview(false);
    setExtractedCredentials([]);
    toast({
      title: "Credenciais adicionadas",
      description: "As credenciais foram adicionadas com sucesso ao workspace!",
    });
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          resolve(content);
        } else {
          reject(new Error("Erro ao ler o conteúdo do arquivo"));
        }
      };
      reader.onerror = (e) => reject(e);
      
      if (file.type === "text/plain") {
        reader.readAsText(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                file.type === "application/vnd.ms-excel") {
        reader.readAsText(file);
      } else {
        reject(new Error("Formato de arquivo não suportado"));
      }
    });
  };

  return (
    <Card className="w-full md:w-[60%] max-w-md mx-auto hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-lg font-medium">Upload de Arquivo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <UploadButton
            isLoading={isLoading}
            isAnalyzing={isAnalyzing}
            aiProgress={aiProgress}
            onChange={handleFileUpload}
          />
          
          <UploadProgress
            isLoading={isLoading}
            isAnalyzing={isAnalyzing}
            uploadProgress={uploadProgress}
            aiProgress={aiProgress}
          />
          
          <p className="text-xs text-muted-foreground text-center">
            Formatos aceitos: .txt, .xlsx, .xls
          </p>
        </div>
      </CardContent>

      <CredentialPreviewDialog
        credentials={extractedCredentials}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmCredentials}
      />
    </Card>
  );
};