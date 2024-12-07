import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Manufacturer, loadManufacturers, saveManufacturers } from "@/utils/manufacturerData";

interface ManufacturerManagerProps {
  selectedManufacturer: string;
  onManufacturerSelect: (manufacturerId: string) => void;
}

export function ManufacturerManager({
  selectedManufacturer,
  onManufacturerSelect,
}: ManufacturerManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(loadManufacturers);
  const [newManufacturerName, setNewManufacturerName] = useState("");
  const [editingManufacturer, setEditingManufacturer] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleAddManufacturer = () => {
    if (!newManufacturerName.trim()) return;

    const newManufacturer: Manufacturer = {
      id: newManufacturerName.toLowerCase().replace(/\s+/g, '-'),
      name: newManufacturerName.trim(),
    };

    const updatedManufacturers = [...manufacturers, newManufacturer];
    setManufacturers(updatedManufacturers);
    saveManufacturers(updatedManufacturers);
    setNewManufacturerName("");
    toast({
      description: "Fabricante adicionado com sucesso",
    });
  };

  const handleEditManufacturer = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer);
  };

  const handleSaveEdit = () => {
    if (!editingManufacturer) return;

    const updatedManufacturers = manufacturers.map((m) =>
      m.id === editingManufacturer.id ? editingManufacturer : m
    );

    setManufacturers(updatedManufacturers);
    saveManufacturers(updatedManufacturers);
    setEditingManufacturer(null);
    toast({
      description: "Fabricante atualizado com sucesso",
    });
  };

  const handleRemoveManufacturer = (manufacturerId: string) => {
    const updatedManufacturers = manufacturers.filter((m) => m.id !== manufacturerId);
    setManufacturers(updatedManufacturers);
    saveManufacturers(updatedManufacturers);
    if (selectedManufacturer === manufacturerId) {
      onManufacturerSelect("");
    }
    toast({
      description: "Fabricante removido com sucesso",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select
          value={selectedManufacturer}
          onChange={(e) => onManufacturerSelect(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecione um fabricante</option>
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer.id} value={manufacturer.id}>
              {manufacturer.name}
            </option>
          ))}
        </select>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerenciar Fabricantes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Novo fabricante"
                  value={newManufacturerName}
                  onChange={(e) => setNewManufacturerName(e.target.value)}
                />
                <Button onClick={handleAddManufacturer}>Adicionar</Button>
              </div>
              <div className="space-y-2">
                {manufacturers.map((manufacturer) => (
                  <div
                    key={manufacturer.id}
                    className="flex items-center justify-between gap-2 p-2 border rounded"
                  >
                    {editingManufacturer?.id === manufacturer.id ? (
                      <>
                        <Input
                          value={editingManufacturer.name}
                          onChange={(e) =>
                            setEditingManufacturer({
                              ...editingManufacturer,
                              name: e.target.value,
                            })
                          }
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleSaveEdit}>Salvar</Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingManufacturer(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span>{manufacturer.name}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEditManufacturer(manufacturer)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveManufacturer(manufacturer.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}