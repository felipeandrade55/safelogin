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
}

export function NetworkNode({ data }: { data: NetworkNodeData }) {
  const Icon = iconMap[data.type] || Computer;
  const size = data.size || 40;
  const color = data.color || "#ffffff";

  return (
    <div
      className="bg-white rounded-lg shadow-lg border border-gray-200"
      style={{
        backgroundColor: color,
        width: size * 2,
        height: size * 2,
        cursor: "move",
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 border-2"
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 border-2"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 border-2"
      />
      <div className="flex flex-col items-center gap-2 p-2">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.label}
            className="w-8 h-8 object-contain"
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
        className="w-3 h-3 border-2"
      />
    </div>
  );
}