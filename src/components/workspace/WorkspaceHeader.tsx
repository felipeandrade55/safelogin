import { CompanySearch } from "@/components/CompanySearch";
import { AddCredentialDialog } from "@/components/AddCredentialDialog";

interface WorkspaceHeaderProps {
  companies: Array<{ id: string; name: string }>;
  selectedCompany: string | null;
  onSelectCompany: (companyId: string) => void;
  onToggleMockData?: () => void;
  isMockDataLoaded?: () => boolean;
}

export function WorkspaceHeader({
  companies,
  selectedCompany,
  onSelectCompany,
  onToggleMockData,
  isMockDataLoaded,
}: WorkspaceHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="w-full md:w-72">
        <CompanySearch
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={onSelectCompany}
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {selectedCompany && <AddCredentialDialog companyId={selectedCompany} />}
      </div>
    </div>
  );
}