import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Brain, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { analyzeDocument } from "@/lib/openai";
import { Progress } from "@/components/ui/progress";

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
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadProgress(0);
    setAiProgress(0);

    try {
      // Simular progresso de upload
      const simulateProgress = () => {
        setUploadProgress((prev) => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      };
      const progressInterval = setInterval(simulateProgress, 200);

      const text = await readFileContent(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Análise com IA
      setIsAnalyzing(true);
      
      // Simular progresso da análise
      const simulateAiProgress = () => {
        setAiProgress((prev) => {
          if (prev < 95) return prev + 5;
          return prev;
        });
      };
      const aiProgressInterval = setInterval(simulateAiProgress, 300);

      const credentials = await analyzeDocument(text);
      clearInterval(aiProgressInterval);
      setAiProgress(100);
      
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
      setIsAnalyzing(false);
      setUploadProgress(0);
      setAiProgress(0);
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
        reader.readAsText(file);
      }
    });
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-lg font-medium">Upload de Arquivo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3">
          <Button
            variant="outline"
            className="w-full h-24 border-dashed relative overflow-hidden"
            disabled={isLoading || isAnalyzing}
          >
            <label className="flex flex-col items-center cursor-pointer">
              {!isLoading && !isAnalyzing && (
                <>
                  <Upload className="h-6 w-6 mb-1" />
                  <span className="text-sm">Clique para fazer upload</span>
                </>
              )}
              {isLoading && (
                <>
                  <FileText className="h-6 w-6 mb-1 animate-pulse text-blue-500" />
                  <span className="text-sm">Enviando arquivo...</span>
                </>
              )}
              {isAnalyzing && (
                <div className="flex flex-col items-center animate-bounce">
                  <div className="relative">
                    <Brain className="h-6 w-6 mb-1 text-purple-500" />
                    <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
                  </div>
                  <span className="text-sm bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                    Processando com I.A.
                  </span>
                  <span className="text-xs text-gray-500">{aiProgress}% concluído</span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept=".txt,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isLoading || isAnalyzing}
              />
            </label>
          </Button>
          
          {(isLoading || isAnalyzing) && (
            <div className="w-full space-y-1">
              <Progress 
                value={isLoading ? uploadProgress : aiProgress} 
                className="h-2"
                // Cores diferentes para upload e análise
                style={{
                  background: isLoading ? 'rgb(219 234 254)' : 'rgb(243 232 255)',
                  '--progress-background': isLoading ? 'rgb(59 130 246)' : 'rgb(147 51 234)'
                } as any}
              />
              <p className="text-xs text-center text-muted-foreground">
                {isLoading ? `Upload: ${uploadProgress}%` : `Análise: ${aiProgress}%`}
              </p>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Formatos: .txt, .xlsx, .xls
          </p>
        </div>
      </CardContent>
    </Card>
  );
};