import { Button } from "@/components/ui/button";
import { Computer, Router, Server, Wifi } from "lucide-react";

const nodeTypes = [
  { type: "computer", label: "Computador", icon: Computer },
  { type: "router", label: "Roteador", icon: Router },
  { type: "server", label: "Servidor", icon: Server },
  { type: "wifi", label: "Wi-Fi", icon: Wifi },
];

interface NetworkToolbarProps {
  onAddNode: (node: any) => void;
}

export function NetworkToolbar({ onAddNode }: NetworkToolbarProps) {
  const handleAddNode = (type: string, label: string) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: "networkNode",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label, type },
    };
    onAddNode(newNode);
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 flex gap-2">
      {nodeTypes.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          onClick={() => handleAddNode(type, label)}
          className="flex items-center gap-2"
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}