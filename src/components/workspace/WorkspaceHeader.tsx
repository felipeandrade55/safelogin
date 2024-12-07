import { Button } from "@/components/ui/button";
import { CompanySelect } from "@/components/CompanySelect";
import { Plus, Download } from "lucide-react";
import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { useNavigate } from "react-router-dom";

interface WorkspaceHeaderProps {
  companies: Array<{ id: string; name: string }>;
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
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <CompanySelect
        companies={companies}
        selectedCompany={selectedCompany}
        onSelectCompany={onSelectCompany}
      />
      <div className="flex items-center gap-2">
        <AddCredentialDialog />
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => navigate(`/export/${selectedCompany}`)}
          disabled={!selectedCompany}
        >
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>
    </div>
  );
}