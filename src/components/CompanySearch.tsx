import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [showSearch, setShowSearch] = useState(false);
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
      const newCompany = await addCompany.mutateAsync({ name: newCompanyName.trim() });
      toast({
        title: "Sucesso",
        description: "Empresa cadastrada com sucesso!",
      });
      setNewCompanyName("");
      setShowNewCompanyInput(false);
      if (newCompany) {
        onSelectCompany(newCompany.id);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar empresa",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
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
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSearch(!showSearch)}
          className="shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowNewCompanyInput(!showNewCompanyInput)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showSearch && (
        <div className="w-full">
          <Input
            type="text"
            placeholder="Pesquisar empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      )}

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
  );
}