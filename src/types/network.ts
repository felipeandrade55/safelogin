import { Node } from '@xyflow/react';

export interface NetworkNodeData {
  label: string;
  type: string;
  properties: {
    ip?: string;
    mac?: string;
    port?: string;
    linkSpeed?: string;
    latency?: string;
  };
  color?: string;
  size?: number;
  [key: string]: unknown; // Add index signature to satisfy Record<string, unknown>
}

export type NetworkNode = Node<NetworkNodeData>;