import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isLoading: boolean;
  isAnalyzing: boolean;
  uploadProgress: number;
  aiProgress: number;
}

export const UploadProgress = ({
  isLoading,
  isAnalyzing,
  uploadProgress,
  aiProgress,
}: UploadProgressProps) => {
  if (!isLoading && !isAnalyzing) return null;

  return (
    <div className="w-full space-y-2">
      <Progress 
        value={isLoading ? uploadProgress : aiProgress} 
        className="h-1.5"
        style={{
          background: isLoading ? 'rgb(219 234 254)' : 'rgb(243 232 255)',
          '--progress-background': isLoading ? 'rgb(59 130 246)' : 'rgb(147 51 234)'
        } as any}
      />
      <p className="text-xs text-center text-muted-foreground">
        {isLoading ? `Upload: ${uploadProgress}%` : `Análise: ${aiProgress}%`}
      </p>
    </div>
  );
};