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
  companies,
  selectedCompany,
  onSelectCompany,
}: CompanySearchProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  const filterCompanies = (term: string) => {
    if (!term) {
      setFilteredCompanies(companies.slice(0, 5));
      return;
    }

    const filtered = companies
      .map(company => ({
        company,
        score: calculateRelevanceScore(company.name.toLowerCase(), term.toLowerCase())
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.company)
      .slice(0, 5);

    setFilteredCompanies(filtered);
  };

  const calculateRelevanceScore = (companyName: string, term: string): number => {
    if (companyName === term) return 100;
    if (companyName.startsWith(term)) return 80;
    if (companyName.includes(term)) return 60;
    
    // Verificar palavras individuais
    const companyWords = companyName.split(' ');
    for (const word of companyWords) {
      if (word.startsWith(term)) return 40;
      if (word.includes(term)) return 20;
    }
    
    return 0;
  };

  const debouncedFilter = debounce(filterCompanies, 300);

  useEffect(() => {
    debouncedFilter(searchTerm);
    return () => {
      debouncedFilter.cancel();
    };
  }, [searchTerm, companies]);

  useEffect(() => {
    setFilteredCompanies(companies.slice(0, 5));
  }, [companies]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCompany
            ? companies.find((company) => company.id === selectedCompany)?.name
            : "Selecione uma empresa..."}
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
              {filteredCompanies.map((company) => (
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