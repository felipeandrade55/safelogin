import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PopManager } from "../PopManager";
import { ManufacturerManager } from "../ManufacturerManager";
import { Textarea } from "../ui/textarea";

interface CredentialFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  cardType: string;
  setCardType: (value: string) => void;
  noteContent: string;
  setNoteContent: (value: string) => void;
  selectedPop: string;
  setSelectedPop: (value: string) => void;
  selectedManufacturer: string;
  setSelectedManufacturer: (value: string) => void;
}

export const CredentialFormFields = ({
  title,
  setTitle,
  cardType,
  setCardType,
  noteContent,
  setNoteContent,
  selectedPop,
  setSelectedPop,
  selectedManufacturer,
  setSelectedManufacturer,
}: CredentialFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Gmail Trabalho"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Grupo</Label>
        <Select value={cardType} onValueChange={setCardType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o grupo" />
          </SelectTrigger>
          <SelectContent>
            {[
              "Infraestrutura",
              "Servidores",
              "Rede",
              "Aplicações",
              "Banco de Dados",
              "Cloud",
              "Desenvolvimento",
              "Monitoramento",
              "Outros",
            ].map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {cardType !== "Anotação" && cardType !== "Site" && (
        <>
          <div className="space-y-2">
            <Label>Localização (POP)</Label>
            <PopManager
              selectedPop={selectedPop}
              onPopSelect={setSelectedPop}
            />
          </div>
          <div className="space-y-2">
            <Label>Fabricante</Label>
            <ManufacturerManager
              selectedManufacturer={selectedManufacturer}
              onManufacturerSelect={setSelectedManufacturer}
            />
          </div>
        </>
      )}

      {cardType === "Anotação" && (
        <div className="space-y-2">
          <Label>Conteúdo da Anotação</Label>
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Digite sua anotação aqui..."
            className="min-h-[200px] resize-y"
            maxLength={5000}
          />
          <p className="text-sm text-muted-foreground text-right">
            {noteContent.length}/5000 caracteres
          </p>
        </div>
      )}
    </>
  );
};