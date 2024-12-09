import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ManufacturerManagerProps {
  selectedManufacturer: string;
  onManufacturerSelect: (value: string) => void;
}

export const ManufacturerManager = ({
  selectedManufacturer,
  onManufacturerSelect,
}: ManufacturerManagerProps) => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [newManufacturer, setNewManufacturer] = useState("");

  const handleAddNew = () => {
    if (!newManufacturer.trim()) {
      toast({
        title: "Erro",
        description: "O nome do fabricante não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    // Add new manufacturer logic here
    setShowAddNew(false);
    setNewManufacturer("");
    toast({
      title: "Sucesso",
      description: "Fabricante adicionado com sucesso!",
    });
  };

  return (
    <div className="space-y-2">
      {!showAddNew ? (
        <div className="flex items-center gap-2">
          <Select value={selectedManufacturer} onValueChange={onManufacturerSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o fabricante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="huawei">Huawei</SelectItem>
              <SelectItem value="cisco">Cisco</SelectItem>
              <SelectItem value="juniper">Juniper</SelectItem>
              <SelectItem value="nokia">Nokia</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowAddNew(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Nome do fabricante"
            value={newManufacturer}
            onChange={(e) => setNewManufacturer(e.target.value)}
          />
          <Button type="button" onClick={handleAddNew}>
            Adicionar
          </Button>
        </div>
      )}
    </div>
  );
};