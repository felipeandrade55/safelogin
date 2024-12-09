import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Manufacturer {
  id: string;
  name: string;
}

export function ManufacturerManager() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(() => {
    const savedManufacturers = localStorage.getItem("manufacturers");
    return savedManufacturers ? JSON.parse(savedManufacturers) : [];
  });
  const [newManufacturer, setNewManufacturer] = useState("");
  const { toast } = useToast();

  const handleAddManufacturer = () => {
    if (!newManufacturer.trim()) return;

    const newManufacturerItem: Manufacturer = {
      id: `manufacturer_${Date.now()}`,
      name: newManufacturer,
    };

    const updatedManufacturers = [...manufacturers, newManufacturerItem];
    setManufacturers(updatedManufacturers);
    localStorage.setItem("manufacturers", JSON.stringify(updatedManufacturers));
    setNewManufacturer("");

    toast({
      description: "Fabricante adicionado com sucesso",
    });
  };

  const handleDeleteManufacturer = (id: string) => {
    const updatedManufacturers = manufacturers.filter(manufacturer => manufacturer.id !== id);
    setManufacturers(updatedManufacturers);
    localStorage.setItem("manufacturers", JSON.stringify(updatedManufacturers));

    toast({
      description: "Fabricante removido com sucesso",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Fabricantes</h3>
        <div>
          <Button variant="outline" size="sm" onClick={handleAddManufacturer}>
            <Plus className="h-4 w-4" />
            Adicionar Fabricante
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {manufacturers.map((manufacturer) => (
          <div key={manufacturer.id} className="flex items-center justify-between p-2 border rounded-lg">
            <span className="text-sm">{manufacturer.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteManufacturer(manufacturer.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
