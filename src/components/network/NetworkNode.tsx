import { Handle, Position } from "@xyflow/react";
import { Computer, Router, Server, Wifi } from "lucide-react";

const iconMap = {
  computer: Computer,
  router: Router,
  server: Server,
  wifi: Wifi,
};

export function NetworkNode({ data }: { data: { label: string; type: keyof typeof iconMap } }) {
  const Icon = iconMap[data.type] || Computer;

  return (
    <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col items-center gap-2">
        <Icon className="w-8 h-8" />
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}