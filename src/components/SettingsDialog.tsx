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

export const SettingsDialog = () => {
  const [open, setOpen] = useState(false);
  const apiKey = localStorage.getItem("openai_api_key") || "";

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
              readOnly
              className="bg-gray-100"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};