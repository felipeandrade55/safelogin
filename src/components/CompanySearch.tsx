import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const sortCompanies = (companiesArray: Company[]) => {
    return [...companiesArray].sort((a, b) => a.name.localeCompare(b.name));
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAndFilteredCompanies = sortCompanies(filteredCompanies);

  return (
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

      {showSearch && (
        <div className="w-full max-w-xs">
          <Input
            type="text"
            placeholder="Pesquisar empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}