import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCompanies } from "@/hooks/useCompanies";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Company {
  id: string;
  name: string;
  description?: string;
}

interface CompanySearchProps {
  companies: Company[];
  selectedCompany: string | null;
  onSelectCompany: (companyId: string) => void;
}

export function CompanySearch({
  companies = [],
  selectedCompany,
  onSelectCompany,
}: CompanySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [showNewCompanyInput, setShowNewCompanyInput] = useState(false);
  
  const { addCompany } = useCompanies();
  const { toast } = useToast();

  const sortCompanies = (companiesArray: Company[]) => {
    return [...companiesArray].sort((a, b) => a.name.localeCompare(b.name));
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAndFilteredCompanies = sortCompanies(filteredCompanies);

  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da empresa não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    try {
      const newCompany = await addCompany.mutateAsync({ 
        name: newCompanyName.trim() 
      });
      
      if (newCompany) {
        toast({
          title: "Sucesso",
          description: "Empresa cadastrada com sucesso!",
        });
        setNewCompanyName("");
        setShowNewCompanyInput(false);
        onSelectCompany(newCompany.id);
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar empresa:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar empresa",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-background rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Empresas</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNewCompanyInput(!showNewCompanyInput)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Pesquisar empresas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <Select
          value={selectedCompany || undefined}
          onValueChange={onSelectCompany}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma empresa..." />
          </SelectTrigger>
          <SelectContent>
            {sortedAndFilteredCompanies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showNewCompanyInput && (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Nome da nova empresa..."
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCompany();
                }
              }}
            />
            <Button onClick={handleAddCompany}>
              Adicionar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}