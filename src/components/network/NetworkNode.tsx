import { Handle, Position } from "@xyflow/react";
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
import { cn } from "@/lib/utils";

const iconMap = {
  computer: Computer,
  router: Router,
  server: Server,
  wifi: Wifi,
  switch: Network,
  printer: Printer,
  database: Database,
  monitor: Monitor,
  radio: Radio,
  smartphone: Smartphone,
};

interface NetworkNodeData {
  label: string;
  type: keyof typeof iconMap;
  color?: string;
  size?: number;
  imageUrl?: string;
  selected?: boolean;
}

export function NetworkNode({ data, selected }: { data: NetworkNodeData; selected?: boolean }) {
  const Icon = iconMap[data.type] || Computer;
  const size = data.size || 40;
  const color = data.color || "#ffffff";

  return (
    <div
      className={cn(
        "relative bg-white rounded-lg shadow-lg border cursor-grab active:cursor-grabbing select-none transition-shadow",
        selected ? "border-primary shadow-xl" : "border-gray-200"
      )}
      style={{
        backgroundColor: color,
        width: size * 2,
        height: size * 2,
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
      <div className="flex flex-col items-center gap-2 p-2">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.label}
            className="w-8 h-8 object-contain"
            draggable={false}
          />
        ) : (
          <Icon className="w-8 h-8" />
        )}
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