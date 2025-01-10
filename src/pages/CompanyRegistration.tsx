import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Building, MapPin, FileText, Database } from "lucide-react";
import { insertSampleCompanies } from "@/utils/sampleCompanies";

export function CompanyRegistration() {
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("companies")
        .insert([
          {
            name,
            cnpj,
            address,
            description,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Empresa cadastrada com sucesso!",
      });

      // Limpa o formulário
      setName("");
      setCnpj("");
      setAddress("");
      setDescription("");
    } catch (error: any) {
      console.error("Erro ao cadastrar empresa:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar a empresa. " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSampleCompanies = async () => {
    setIsLoading(true);
    await insertSampleCompanies();
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Cadastro de Empresa
          </CardTitle>
          <Button
            variant="outline"
            onClick={handleCreateSampleCompanies}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Criar Empresas de Exemplo
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Nome da Empresa *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Digite o nome da empresa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                CNPJ
              </Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="Digite o CNPJ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Digite o endereço"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descrição
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite uma descrição para a empresa"
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar Empresa"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}