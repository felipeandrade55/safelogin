import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  Panel,
  ReactFlowProvider,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import "@xyflow/react/dist/style.css";
import { NetworkNode } from "@/components/network/NetworkNode";
import { NetworkToolbar } from "@/components/network/NetworkToolbar";
import { NetworkNodeEditor } from "@/components/network/NetworkNodeEditor";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Download, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from 'react-dropzone';

const nodeTypes = {
  networkNode: NetworkNode,
};

const defaultEdgeOptions = {
  animated: true,
  style: {
    stroke: '#3b82f6',
    strokeWidth: 2,
  },
};

function Flow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { setCenter, getZoom, setViewport, zoomIn, zoomOut } = useReactFlow();

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
    toast.success("Conexão estabelecida com sucesso!");
  }, []);

  const centerNode = useCallback((node: Node) => {
    const x = node.position.x + (node.width || 0) / 2;
    const y = node.position.y + (node.height || 0) / 2;
    const zoom = getZoom();
    setViewport({ x: -x * zoom + window.innerWidth / 2, y: -y * zoom + window.innerHeight / 2, zoom });
  }, [getZoom, setViewport]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    centerNode(node);
  }, [centerNode]);

  const handleNodeUpdate = (updates: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode?.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      })
    );
    setSelectedNode(null);
    toast.success("Dispositivo atualizado com sucesso!");
  };

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          setNodes(jsonData.nodes || []);
          setEdges(jsonData.edges || []);
          toast.success("Mapa de rede importado com sucesso!");
        } catch (error) {
          toast.error("Erro ao importar o arquivo. Verifique se é um arquivo JSON válido.");
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    multiple: false
  });

  return (
    <div className="flex h-screen">
      <NetworkToolbar onAddNode={(node) => {
        setNodes((nds) => [...nds, node]);
        toast.success("Dispositivo adicionado com sucesso!");
      }} />
      <div className="flex-1 relative" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive && (
          <div className="absolute inset-0 bg-primary/10 z-50 flex items-center justify-center">
            <div className="bg-background p-4 rounded-lg shadow-lg">
              Solte o arquivo JSON aqui para importar
            </div>
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={4}
          className="bg-background"
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel position="top-right" className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => zoomIn()}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => zoomOut()}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleSaveNetwork}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" {...getRootProps()}>
              <Upload className="h-4 w-4" />
            </Button>
          </Panel>
        </ReactFlow>
      </div>

      <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Editar Dispositivo</SheetTitle>
          </SheetHeader>
          {selectedNode && (
            <NetworkNodeEditor node={selectedNode} onUpdate={handleNodeUpdate} />
          )}
        </SheetContent>
      </Sheet>
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