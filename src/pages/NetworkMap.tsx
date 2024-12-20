import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
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

const nodeTypes = {
  networkNode: NetworkNode,
};

function Flow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node);
  }, []);

  const onNodeDoubleClick = useCallback((event: any, node: any) => {
    const viewport = getViewport();
    const centerX = (window.innerWidth / 2 - viewport.x) / viewport.zoom;
    const centerY = (window.innerHeight / 2 - viewport.y) / viewport.zoom;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            position: { x: centerX, y: centerY },
          };
        }
        return n;
      })
    );
  }, []);

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
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <NetworkToolbar onAddNode={(node) => setNodes((nds) => [...nds, node])} />
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          fitView
          draggable={true}
          nodesDraggable={true}
        >
          <Background />
          <Controls />
          <MiniMap />
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