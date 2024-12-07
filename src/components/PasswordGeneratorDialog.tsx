import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wand2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface PasswordGeneratorDialogProps {
  onPasswordGenerated: (password: string) => void;
}

type PasswordType = "numbers" | "alphanumeric" | "complex";

export function PasswordGeneratorDialog({ onPasswordGenerated }: PasswordGeneratorDialogProps) {
  const [length, setLength] = useState<number>(8);
  const [type, setType] = useState<PasswordType>("complex");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    let chars = "";
    const numbers = "0123456789";
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    switch (type) {
      case "numbers":
        chars = numbers;
        break;
      case "alphanumeric":
        chars = numbers + letters;
        break;
      case "complex":
        chars = numbers + letters + special;
        break;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    onPasswordGenerated(password);
    setOpen(false);
    toast({
      description: "Senha gerada com sucesso!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Wand2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerador de Senha</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="length">Tamanho da senha</Label>
            <Input
              id="length"
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              min={4}
              max={32}
            />
          </div>
          <div className="grid gap-2">
            <Label>Tipo de senha</Label>
            <RadioGroup value={type} onValueChange={(value) => setType(value as PasswordType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="numbers" id="numbers" />
                <Label htmlFor="numbers">Somente números</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alphanumeric" id="alphanumeric" />
                <Label htmlFor="alphanumeric">Números e letras</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complex" id="complex" />
                <Label htmlFor="complex">Números, letras e caracteres especiais</Label>
              </div>
            </RadioGroup>
          </div>
          <Button onClick={generatePassword}>Gerar Senha</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}