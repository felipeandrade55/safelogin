import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { NetworkToolbar } from "@/components/network/NetworkToolbar";
import { FlowComponent } from "@/components/network/FlowComponent";
import { MapActions } from "@/components/network/MapActions";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

function Flow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleSaveNetwork = () => {
    const networkData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(networkData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `network-map-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Mapa de rede exportado com sucesso!");
  };

  const handleLoadNetwork = (data: { nodes: Node[], edges: Edge[] }) => {
    setNodes(data.nodes || []);
    setEdges(data.edges || []);
  };

  const handleAddNode = (node: Node) => {
    setNodes((nds) => [...nds, node]);
    toast.success("Dispositivo adicionado com sucesso!");
  };

  return (
    <div className="flex h-screen">
      <NetworkToolbar onAddNode={handleAddNode} />
      <div className="flex-1 relative">
        <FlowComponent
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
        />
        <MapActions onSave={handleSaveNetwork} onLoad={handleLoadNetwork} />
      </div>
    </div>
  );
}

export function NetworkMap() {
  return (
    <SidebarProvider defaultOpen>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </SidebarProvider>
  );
}