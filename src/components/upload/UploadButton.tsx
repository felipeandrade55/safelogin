import { Upload, FileText, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadButtonProps {
  isLoading: boolean;
  isAnalyzing: boolean;
  aiProgress: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadButton = ({
  isLoading,
  isAnalyzing,
  aiProgress,
  onChange
}: UploadButtonProps) => {
  return (
    <Button
      variant="outline"
      className="w-full min-h-[4rem] border-dashed relative overflow-hidden transition-all hover:border-primary/50"
      disabled={isLoading || isAnalyzing}
    >
      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer gap-2">
        {!isLoading && !isAnalyzing && (
          <>
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-sm">Clique para fazer upload</span>
          </>
        )}
        {isLoading && (
          <>
            <FileText className="h-5 w-5 mb-1 animate-pulse text-blue-500" />
            <span className="text-sm">Enviando arquivo...</span>
          </>
        )}
        {isAnalyzing && (
          <div className="flex flex-col items-center animate-bounce">
            <div className="relative mb-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
            </div>
            <span className="text-sm bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold">
              Processando com I.A.
            </span>
            <span className="text-xs text-gray-500 mt-1">{aiProgress}% concluído</span>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          accept=".txt,.xlsx,.xls"
          onChange={onChange}
          disabled={isLoading || isAnalyzing}
        />
      </label>
    </Button>
  );
};