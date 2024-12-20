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

export interface NetworkNode extends Node {
  data: NetworkNodeData;
}