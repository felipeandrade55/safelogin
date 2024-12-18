import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { configureSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const SupabaseConfig = () => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || !anonKey) {
      toast({
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    try {
      configureSupabase(url, anonKey);
      setOpen(false);
      toast({
        description: "Configuração do Supabase atualizada com sucesso",
      });
    } catch (error) {
      toast({
        description: "Erro ao configurar o Supabase",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isSupabaseConfigured() ? "outline" : "default"}>
          {isSupabaseConfigured() ? "Reconfigurar Supabase" : "Configurar Supabase"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar Supabase Self-hosted</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL do Supabase</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://seu-projeto.supabase.co"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="anon-key">Chave Anônima</Label>
            <Input
              id="anon-key"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              type="password"
              placeholder="sua-chave-anonima"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Salvar Configuração
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};