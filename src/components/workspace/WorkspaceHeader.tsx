import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { useState } from "react";
import { CompanySearch } from "@/components/CompanySearch";

interface WorkspaceHeaderProps {
  companies: any[];
  selectedCompany: string | null;
  onSelectCompany: (companyId: string) => void;
}

export function WorkspaceHeader({
  companies,
  selectedCompany,
  onSelectCompany,
}: WorkspaceHeaderProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Credenciais</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas credenciais de acesso
          </p>
        </div>

        {selectedCompany && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Credencial
          </Button>
        )}
      </div>

      <CompanySearch
        companies={companies}
        selectedCompany={selectedCompany}
        onSelectCompany={onSelectCompany}
      />

      <AddCredentialDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        companyId={selectedCompany}
      />
    </div>
  );
}