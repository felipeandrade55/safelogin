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
import { Badge } from "@/components/ui/badge";
import { Flag, loadFlags, saveFlags } from "@/utils/flagsData";
import { Settings2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

export function FlagManager() {
  const [flags, setFlags] = useState<Flag[]>(loadFlags());
  const [newFlagName, setNewFlagName] = useState("");
  const { toast } = useToast();

  const addFlag = () => {
    if (!newFlagName.trim()) return;
    
    const newFlag: Flag = {
      id: `flag_${Date.now()}`,
      name: newFlagName,
      color: `bg-${['blue', 'green', 'yellow', 'red', 'purple', 'indigo', 'orange', 'teal', 'pink'][Math.floor(Math.random() * 9)]}-500`,
    };

    const updatedFlags = [...flags, newFlag];
    setFlags(updatedFlags);
    saveFlags(updatedFlags);
    setNewFlagName("");
    
    toast({
      description: "Flag adicionada com sucesso",
    });
  };

  const removeFlag = (id: string) => {
    const updatedFlags = flags.filter(flag => flag.id !== id);
    setFlags(updatedFlags);
    saveFlags(updatedFlags);
    
    toast({
      description: "Flag removida com sucesso",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Gerenciar Flags
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Flags</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nova flag..."
              value={newFlagName}
              onChange={(e) => setNewFlagName(e.target.value)}
            />
            <Button onClick={addFlag}>Adicionar</Button>
          </div>
          <div className="space-y-2">
            {flags.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between gap-2">
                <Badge className={`${flag.color} text-white`}>{flag.name}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFlag(flag.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}