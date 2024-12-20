import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NetworkNodeEditorProps {
  node: {
    data: {
      label: string;
      type: string;
      color?: string;
      size?: number;
      imageUrl?: string;
    };
  };
  onUpdate: (updates: any) => void;
}

export function NetworkNodeEditor({ node, onUpdate }: NetworkNodeEditorProps) {
  const [label, setLabel] = useState(node.data.label);
  const [color, setColor] = useState(node.data.color || "#ffffff");
  const [size, setSize] = useState(node.data.size || 40);
  const [imageUrl, setImageUrl] = useState(node.data.imageUrl || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      label,
      color,
      size: Number(size),
      imageUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="label">Nome</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nome do node"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="color">Cor</Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-10 p-1"
          />
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Tamanho</Label>
        <Input
          id="size"
          type="number"
          min={20}
          max={200}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://exemplo.com/imagem.png"
        />
      </div>

      <Button type="submit" className="w-full">
        Atualizar
      </Button>
    </form>
  );
}