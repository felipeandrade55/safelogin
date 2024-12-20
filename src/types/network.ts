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
}

export type NetworkNode = Node<NetworkNodeData>;