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
  Phone,
  Cloud,
  Box,
  HardDrive,
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
    label: "Infra-Estrutura",
    items: [
      { type: "server", label: "Servidor", icon: Server },
      { type: "rack", label: "Rack", icon: HardDrive },
      { type: "database", label: "Banco de Dados", icon: Database },
      { type: "olt", label: "OLT", icon: Box },
    ],
  },
  {
    label: "Dispositivos de Rede",
    items: [
      { type: "router", label: "Roteador", icon: Router },
      { type: "switch", label: "Switch", icon: Network },
      { type: "wifi", label: "Wi-Fi", icon: Wifi },
    ],
  },
  {
    label: "Endpoints",
    items: [
      { type: "computer", label: "Computador", icon: Computer },
      { type: "monitor", label: "Monitor", icon: Monitor },
      { type: "smartphone", label: "Smartphone", icon: Smartphone },
      { type: "phone", label: "Telefone IP", icon: Phone },
      { type: "printer", label: "Impressora", icon: Printer },
    ],
  },
  {
    label: "Redes e Conexões",
    items: [
      { type: "cloud", label: "Nuvem", icon: Cloud },
      { type: "network", label: "Rede Local", icon: Network },
      { type: "radio", label: "Rádio", icon: Radio },
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