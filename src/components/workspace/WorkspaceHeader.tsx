import { Button } from "@/components/ui/button";
import { CompanySelect } from "@/components/CompanySelect";
import { Company } from "@/types/company";

interface WorkspaceHeaderProps {
  companies: Company[];
  selectedCompany: string | null;
  onSelectCompany: (companyId: string) => void;
  onToggleMockData: () => void;
  isMockDataLoaded: () => boolean;
}

export function WorkspaceHeader({
  companies,
  selectedCompany,
  onSelectCompany,
  onToggleMockData,
  isMockDataLoaded,
}: WorkspaceHeaderProps) {
  return (
    <div className="space-y-6 md:space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Minhas Credenciais</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onToggleMockData}
            className="w-full md:w-auto"
          >
            {isMockDataLoaded() ? "Remover Dados de Teste" : "Carregar Dados de Teste"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CompanySelect
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={onSelectCompany}
        />
      </div>
    </div>
  );
}