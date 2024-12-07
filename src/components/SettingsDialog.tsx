import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const SettingsDialog = () => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("openai_api_key") || "");
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem("openai_api_key", apiKey);
    setOpen(false);
    toast({
      title: "Configurações salvas",
      description: "As configurações da OpenAI foram atualizadas com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave da API OpenAI</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};