import { Button } from "@/components/ui/button";
import {
  Computer,
  Router,
  Server,
  Wifi,
  Network,
  Printer,
  Database,
  Monitor,
  Radio,
  Smartphone,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

const nodeTypes = [
  { type: "computer", label: "Computador", icon: Computer },
  { type: "router", label: "Roteador", icon: Router },
  { type: "server", label: "Servidor", icon: Server },
  { type: "wifi", label: "Wi-Fi", icon: Wifi },
  { type: "switch", label: "Switch", icon: Network },
  { type: "printer", label: "Impressora", icon: Printer },
  { type: "database", label: "Banco de Dados", icon: Database },
  { type: "monitor", label: "Monitor", icon: Monitor },
  { type: "radio", label: "Rádio", icon: Radio },
  { type: "smartphone", label: "Smartphone", icon: Smartphone },
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
    <Sidebar>
      <SidebarHeader className="border-b border-border/10 p-4">
        <h2 className="text-lg font-semibold">Componentes de Rede</h2>
      </SidebarHeader>
      <SidebarContent>
        <div className="flex flex-col gap-2 p-4">
          {nodeTypes.map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => handleAddNode(type, label)}
              className="flex items-center justify-start gap-2 w-full"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}