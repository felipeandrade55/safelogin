import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NetworkNode } from "@/types/network";

interface NetworkNodeEditorProps {
  node: NetworkNode;
  onUpdate: (updates: any) => void;
}

export function NetworkNodeEditor({ node, onUpdate }: NetworkNodeEditorProps) {
  const [label, setLabel] = useState(node.data.label);
  const [color, setColor] = useState(node.data.color || "#ffffff");
  const [size, setSize] = useState(node.data.size || 40);
  const [properties, setProperties] = useState(node.data.properties);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      label,
      color,
      size: Number(size),
      properties,
    });
  };

  const updateProperty = (key: string, value: string) => {
    setProperties(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="label">Nome</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nome do dispositivo"
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
        <Label htmlFor="ip">Endereço IP</Label>
        <Input
          id="ip"
          value={properties.ip}
          onChange={(e) => updateProperty('ip', e.target.value)}
          placeholder="192.168.1.1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mac">Endereço MAC</Label>
        <Input
          id="mac"
          value={properties.mac}
          onChange={(e) => updateProperty('mac', e.target.value)}
          placeholder="00:00:00:00:00:00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="port">Porta</Label>
        <Input
          id="port"
          value={properties.port}
          onChange={(e) => updateProperty('port', e.target.value)}
          placeholder="80"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkSpeed">Velocidade do Link</Label>
        <Input
          id="linkSpeed"
          value={properties.linkSpeed}
          onChange={(e) => updateProperty('linkSpeed', e.target.value)}
          placeholder="1 Gbps"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="latency">Latência</Label>
        <Input
          id="latency"
          value={properties.latency}
          onChange={(e) => updateProperty('latency', e.target.value)}
          placeholder="5ms"
        />
      </div>

      <Button type="submit" className="w-full">
        Atualizar
      </Button>
    </form>
  );
}