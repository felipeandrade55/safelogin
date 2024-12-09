import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Pop {
  id: string;
  name: string;
  address: string;
}

interface PopManagerProps {
  selectedPop?: string;
  onPopSelect: (popId: string) => void;
}

export function PopManager({ selectedPop, onPopSelect }: PopManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pops, setPops] = useState<Pop[]>(() => {
    const savedPops = localStorage.getItem("pops");
    return savedPops ? JSON.parse(savedPops) : [];
  });
  const [newPop, setNewPop] = useState({ name: "", address: "" });
  const [editingPop, setEditingPop] = useState<Pop | null>(null);
  const { toast } = useToast();

  const savePops = (updatedPops: Pop[]) => {
    localStorage.setItem("pops", JSON.stringify(updatedPops));
    setPops(updatedPops);
  };

  const handleAddPop = () => {
    if (!newPop.name || !newPop.address) {
      toast({
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const newPopItem = {
      id: `pop_${Date.now()}`,
      name: newPop.name,
      address: newPop.address,
    };

    savePops([...pops, newPopItem]);
    setNewPop({ name: "", address: "" });
    setIsEditMode(false);
    
    toast({
      description: "POP adicionado com sucesso",
    });
  };

  const handleEditPop = (pop: Pop) => {
    setEditingPop(pop);
    setNewPop({ name: pop.name, address: pop.address });
    setIsEditMode(true);
  };

  const handleUpdatePop = () => {
    if (!editingPop || !newPop.name || !newPop.address) return;

    const updatedPops = pops.map((pop) =>
      pop.id === editingPop.id
        ? { ...pop, name: newPop.name, address: newPop.address }
        : pop
    );

    savePops(updatedPops);
    setNewPop({ name: "", address: "" });
    setEditingPop(null);
    setIsEditMode(false);
    
    toast({
      description: "POP atualizado com sucesso",
    });
  };

  const handleDeletePop = (popId: string) => {
    const updatedPops = pops.filter((pop) => pop.id !== popId);
    savePops(updatedPops);
    if (selectedPop === popId) {
      onPopSelect("");
    }
    
    toast({
      description: "POP removido com sucesso",
    });
  };

  const handleSelectPop = (popId: string) => {
    onPopSelect(popId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {selectedPop
            ? pops.find((pop) => pop.id === selectedPop)?.name || "Selecionar POP"
            : "Selecionar POP"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerenciar POPs</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Nome do POP</Label>
            <Input
              value={newPop.name}
              onChange={(e) => setNewPop({ ...newPop, name: e.target.value })}
              placeholder="Ex: POP Centro"
            />
          </div>

          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input
              value={newPop.address}
              onChange={(e) => setNewPop({ ...newPop, address: e.target.value })}
              placeholder="Ex: Rua Principal, 123"
            />
          </div>

          <Button
            className="w-full"
            onClick={isEditMode ? handleUpdatePop : handleAddPop}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isEditMode ? "Atualizar POP" : "Adicionar POP"}
          </Button>

          <div className="space-y-2">
            {pops.map((pop) => (
              <div
                key={pop.id}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex-1 cursor-pointer" onClick={() => handleSelectPop(pop.id)}>
                  <p className="font-medium">{pop.name}</p>
                  <p className="text-sm text-muted-foreground">{pop.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditPop(pop)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePop(pop.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
