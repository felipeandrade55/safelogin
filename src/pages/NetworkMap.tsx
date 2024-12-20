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
import { ZoomIn, ZoomOut } from "lucide-react";

// Define the type for our network node data
interface NetworkNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  color?: string;
  size?: number;
  imageUrl?: string;
}

// Extend the Node type with our custom data
type CustomNode = Node<NetworkNodeData>;

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
  const [nodes, setNodes] = useState<CustomNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const { setCenter, getZoom, setViewport, zoomIn, zoomOut } = useReactFlow();

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds) as CustomNode[]);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const centerNode = useCallback((node: CustomNode) => {
    const x = node.position.x + (node.width || 0) / 2;
    const y = node.position.y + (node.height || 0) / 2;
    const zoom = getZoom();
    setViewport({ x: -x * zoom + window.innerWidth / 2, y: -y * zoom + window.innerHeight / 2, zoom });
  }, [getZoom, setViewport]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: CustomNode) => {
    setSelectedNode(node);
  }, []);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: CustomNode) => {
    centerNode(node);
  }, [centerNode]);

  const handleNodeUpdate = (updates: Partial<NetworkNodeData>) => {
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
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <NetworkToolbar onAddNode={(node) => setNodes((nds) => [...nds, node as CustomNode])} />
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick as any}
          onNodeDoubleClick={onNodeDoubleClick as any}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={4}
          className="touch-none"
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
          </Panel>
        </ReactFlow>
      </div>

      <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Editar Node</SheetTitle>
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