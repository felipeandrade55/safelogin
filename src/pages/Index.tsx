import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { EditCredentialDialog } from "@/components/workspace/EditCredentialDialog";
import { useEffect } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const { companies } = useCompanies();

  useEffect(() => {
    if (companies.length > 0) {
      toast({
        description: `${companies.length} empresas carregadas com sucesso!`,
      });
    }
  }, [companies]);

  return (
    <WorkspaceProvider>
      {({
        workspaceTabs,
        activeTab,
        credentials,
        editingCredential,
        handleCompanySelect,
        handleTabChange,
        handleCloseTab,
        handleSearchChange,
        handleEdit,
        handleEditSubmit,
        handleEditClose,
      }) => (
        <div className="min-h-screen bg-secondary p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <WorkspaceHeader
              companies={companies}
              selectedCompany={
                activeTab
                  ? workspaceTabs.find((tab) => tab.id === activeTab)?.companyId || null
                  : null
              }
              onSelectCompany={handleCompanySelect}
            />

            {workspaceTabs.length > 0 && (
              <WorkspaceTabs
                tabs={workspaceTabs}
                companies={companies}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onCloseTab={handleCloseTab}
                onSearchChange={handleSearchChange}
                getFilteredCredentials={(companyId: string, searchTerm: string) => {
                  if (!credentials) return [];
                  return credentials.filter((cred) =>
                    cred.title.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                }}
                onCredentialsGenerated={(newCredentials: any[]) => {
                  console.log("New credentials:", newCredentials);
                }}
                onEdit={handleEdit}
              />
            )}

            <EditCredentialDialog
              credential={editingCredential}
              onClose={handleEditClose}
              onSubmit={handleEditSubmit}
            />
          </div>
        </div>
      )}
    </WorkspaceProvider>
  );
};

export default Index;