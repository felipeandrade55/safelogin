import { Button } from "@/components/ui/button";
import {
  Router,
  Server,
  Wifi,
  Network,
  Computer,
  Cloud,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const nodeGroups = [
  {
    label: "Dispositivos de Rede",
    items: [
      { type: "router", label: "Roteador", icon: Router },
      { type: "switch", label: "Switch", icon: Network },
      { type: "wifi", label: "Wi-Fi", icon: Wifi },
    ],
  },
  {
    label: "Servidores e Cloud",
    items: [
      { type: "server", label: "Servidor", icon: Server },
      { type: "cloud", label: "Cloud", icon: Cloud },
    ],
  },
  {
    label: "Endpoints",
    items: [
      { type: "computer", label: "Computador", icon: Computer },
    ],
  },
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
      data: { 
        label, 
        type,
        properties: {
          ip: "",
          mac: "",
          port: "",
          linkSpeed: "",
          latency: "",
        }
      },
    };
    onAddNode(newNode);
  };

  return (
    <Sidebar className="w-64">
      <SidebarHeader className="border-b border-border/10 p-4">
        <h2 className="text-lg font-semibold">Componentes de Rede</h2>
      </SidebarHeader>
      <SidebarContent>
        {nodeGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex flex-col gap-2 p-2">
                {group.items.map(({ type, label, icon: Icon }) => (
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
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}