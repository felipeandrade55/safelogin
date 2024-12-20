import { Button } from "@/components/ui/button";
import { Download, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { Panel } from "@xyflow/react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface MapActionsProps {
  onSave: () => void;
  onLoad: (data: any) => void;
}

export function MapActions({ onSave, onLoad }: MapActionsProps) {
  const { zoomIn, zoomOut } = useReactFlow();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target?.result as string);
            onLoad(jsonData);
            toast.success("Mapa de rede importado com sucesso!");
          } catch (error) {
            toast.error("Erro ao importar o arquivo. Verifique se é um arquivo JSON válido.");
          }
        };
        reader.readAsText(file);
      }
    },
    accept: {
      'application/json': ['.json']
    },
    multiple: false
  });

  return (
    <Panel position="top-right" className="flex gap-2">
      <Button variant="outline" size="icon" onClick={() => zoomIn()}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => zoomOut()}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onSave}>
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" {...getRootProps()}>
        <input {...getInputProps()} />
        <Upload className="h-4 w-4" />
      </Button>
    </Panel>
  );
}