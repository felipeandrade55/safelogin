import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CompanyFormProps {
  onSubmit: (data: {
    companyName: string;
    description: string;
    cnpj: string;
    address: string;
  }) => Promise<void>;
  loading: boolean;
  disabled?: boolean;
}

export const CompanyForm = ({ onSubmit, loading, disabled }: CompanyFormProps) => {
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ companyName, description, cnpj, address });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Nome da Empresa *</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Digite o nome da empresa"
          disabled={loading || disabled}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cnpj">CNPJ (opcional)</Label>
        <Input
          id="cnpj"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          placeholder="Digite o CNPJ da empresa"
          disabled={loading || disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço (opcional)</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Digite o endereço da empresa"
          disabled={loading || disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite uma descrição para a empresa"
          disabled={loading || disabled}
        />
      </div>

      {!disabled && (
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            "Registrar Empresa"
          )}
        </Button>
      )}
    </form>
  );
};