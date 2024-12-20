import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { NetworkNode } from "@/components/network/NetworkNode";
import { NetworkNodeEditor } from "@/components/network/NetworkNodeEditor";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { NetworkNode as NetworkNodeType } from "@/types/network";

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

interface FlowComponentProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export function FlowComponent({ nodes, edges, setNodes, setEdges }: FlowComponentProps) {
  const [selectedNode, setSelectedNode] = useState<NetworkNodeType | null>(null);
  const { setCenter, getZoom, setViewport } = useReactFlow();

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(applyNodeChanges(changes, nodes));
  }, [nodes, setNodes]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(applyEdgeChanges(changes, edges));
  }, [edges, setEdges]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
    toast.success("Conexão estabelecida com sucesso!");
  }, [setEdges]);

  const centerNode = useCallback((node: Node) => {
    const x = node.position.x + (node.width || 0) / 2;
    const y = node.position.y + (node.height || 0) / 2;
    const zoom = getZoom();
    setViewport({ x: -x * zoom + window.innerWidth / 2, y: -y * zoom + window.innerHeight / 2, zoom });
  }, [getZoom, setViewport]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as NetworkNodeType);
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

  return (
    <>
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
      </ReactFlow>

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
    </>
  );
}