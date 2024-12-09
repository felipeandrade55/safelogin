import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotesCardProps {
  companyId: string;
}

export const NotesCard = ({ companyId }: NotesCardProps) => {
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const maxLength = 5000;

  useEffect(() => {
    const savedNotes = localStorage.getItem(`company_notes_${companyId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [companyId]);

  const handleSave = () => {
    localStorage.setItem(`company_notes_${companyId}`, notes);
    toast({
      title: "Notas salvas",
      description: "Suas anotações foram salvas com sucesso.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setNotes(value);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Bloco de Notas</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Textarea
            value={notes}
            onChange={handleChange}
            placeholder="Digite suas anotações aqui..."
            className="min-h-[200px] resize-y"
          />
          <p className="text-sm text-muted-foreground text-right">
            {notes.length}/{maxLength} caracteres
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
