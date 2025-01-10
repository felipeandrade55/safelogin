import { Handle, Position } from "@xyflow/react";
import {
  Router,
  Server,
  Wifi,
  Network,
  Computer,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  router: Router,
  server: Server,
  wifi: Wifi,
  switch: Network,
  computer: Computer,
  cloud: Cloud,
};

interface NetworkNodeData {
  label: string;
  type: keyof typeof iconMap;
  properties: {
    ip?: string;
    mac?: string;
    port?: string;
    linkSpeed?: string;
    latency?: string;
  };
  color?: string;
  size?: number;
  selected?: boolean;
}

export function NetworkNode({ data, selected }: { data: NetworkNodeData; selected?: boolean }) {
  const Icon = iconMap[data.type] || Computer;
  const size = data.size || 40;
  const color = data.color || "#ffffff";

  return (
    <div
      className={cn(
        "relative bg-white rounded-lg shadow-lg border cursor-grab active:cursor-grabbing select-none",
        selected ? "border-primary shadow-xl" : "border-gray-200"
      )}
      style={{
        backgroundColor: color,
        width: size * 2,
        height: size * 2,
        padding: "8px",
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 !bg-white border-2 border-gray-400 hover:border-black"
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 !bg-white border-2 border-gray-400 hover:border-black"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 !bg-white border-2 border-gray-400 hover:border-black"
      />
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <Icon className="w-8 h-8" />
        <span className="text-sm font-medium text-center break-words w-full">
          {data.label}
        </span>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-white border-2 border-gray-400 hover:border-black"
      />
    </div>
  );
}