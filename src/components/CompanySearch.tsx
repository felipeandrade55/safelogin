import { useState } from "react";
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
  // Função para ordenar empresas alfabeticamente
  const sortCompanies = (companiesArray: Company[]) => {
    return [...companiesArray].sort((a, b) => a.name.localeCompare(b.name));
  };

  const sortedCompanies = sortCompanies(companies);

  return (
    <Select
      value={selectedCompany || undefined}
      onValueChange={onSelectCompany}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione uma empresa..." />
      </SelectTrigger>
      <SelectContent>
        {sortedCompanies.map((company) => (
          <SelectItem key={company.id} value={company.id}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}