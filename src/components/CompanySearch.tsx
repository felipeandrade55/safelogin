import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import debounce from "lodash.debounce";

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
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  // Função para ordenar empresas alfabeticamente
  const sortCompanies = (companiesArray: Company[]) => {
    return [...companiesArray].sort((a, b) => a.name.localeCompare(b.name));
  };

  // Seleciona a primeira empresa por padrão ao montar o componente
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      const sortedCompanies = sortCompanies(companies);
      onSelectCompany(sortedCompanies[0].id);
      setFilteredCompanies(sortedCompanies.slice(0, 5));
    }
  }, [companies, selectedCompany, onSelectCompany]);

  const filterCompanies = (term: string) => {
    if (!Array.isArray(companies)) {
      console.warn('Companies prop is not an array');
      setFilteredCompanies([]);
      return;
    }

    const sorted = sortCompanies(companies);
    const filtered = sorted
      .filter(company => {
        if (!term) return true;
        return company.name.toLowerCase().includes(term.toLowerCase());
      })
      .slice(0, 5);

    setFilteredCompanies(filtered);
  };

  const debouncedFilter = debounce(filterCompanies, 300);

  useEffect(() => {
    debouncedFilter(searchTerm);
    return () => {
      debouncedFilter.cancel();
    };
  }, [searchTerm, companies]);

  useEffect(() => {
    if (Array.isArray(companies)) {
      const sorted = sortCompanies(companies);
      setFilteredCompanies(sorted.slice(0, 5));
    }
  }, [companies]);

  const selectedCompanyName = selectedCompany 
    ? companies.find((company) => company.id === selectedCompany)?.name 
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCompanyName || "Selecione uma empresa..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Pesquisar empresa..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>Nenhuma empresa encontrada.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[200px]">
              {(filteredCompanies || []).map((company) => (
                <CommandItem
                  key={company.id}
                  value={company.id}
                  onSelect={() => {
                    onSelectCompany(company.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCompany === company.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {company.name}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}