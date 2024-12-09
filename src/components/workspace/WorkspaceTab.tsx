import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface WorkspaceTabProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const WorkspaceTab = ({ title, onEdit, onDelete }: WorkspaceTabProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = () => {
    onEdit();
    toast({
      description: "Editing workspace tab.",
    });
  };

  const handleDelete = () => {
    onDelete();
    toast({
      description: "Workspace tab deleted.",
    });
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1"
      />
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={handleEdit}>
          Edit
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};
