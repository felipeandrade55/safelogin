import { Button } from "@/components/ui/button";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";

interface MapActionsProps {
  onSave: () => void;
  onLoad: (data: any) => void;
}

export function MapActions({ onSave, onLoad }: MapActionsProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onLoad(data);
        toast.success("Mapa de rede carregado com sucesso!");
      } catch (error) {
        console.error("Error parsing network map file:", error);
        toast.error("Erro ao carregar o arquivo. Verifique se é um arquivo válido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onSave}
      >
        <Save className="w-4 h-4" />
        Exportar
      </Button>
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => document.getElementById("map-file-input")?.click()}
        >
          <Upload className="w-4 h-4" />
          Importar
        </Button>
        <input
          type="file"
          id="map-file-input"
          className="hidden"
          accept=".json"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}