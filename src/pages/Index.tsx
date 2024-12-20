import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs } from "@/components/ui/tabs";
import { EditCredentialForm } from "@/components/EditCredentialForm";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { useCompanies } from "@/hooks/useCompanies";
import { useCredentials } from "@/hooks/useCredentials";

interface WorkspaceTab {
  id: string;
  companyId: string;
  searchTerm: string;
}

const Index = () => {
  const [workspaceTabs, setWorkspaceTabs] = useState<WorkspaceTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [editingCredential, setEditingCredential] = useState<any>(null);

  const { companies } = useCompanies();
  const { credentials, updateCredential } = useCredentials(
    activeTab ? workspaceTabs.find((tab) => tab.id === activeTab)?.companyId : undefined
  );

  const handleEdit = () => {
    setEditingCredential({});
  };

  const handleEditSubmit = async (updatedData: any) => {
    if (editingCredential) {
      const currentCompanyId = workspaceTabs.find(tab => tab.id === activeTab)?.companyId;
      if (currentCompanyId) {
        await updateCredential.mutateAsync({
          id: editingCredential.id,
          updates: updatedData
        });
        setEditingCredential(null);
      }
    }
  };

  const handleCompanySelect = (companyId: string) => {
    if (!workspaceTabs.length) {
      const newTab: WorkspaceTab = {
        id: `tab-${Date.now()}`,
        companyId,
        searchTerm: "",
      };
      setWorkspaceTabs([newTab]);
      setActiveTab(newTab.id);
    } else {
      const existingTab = workspaceTabs.find((tab) => tab.companyId === companyId);
      if (!existingTab) {
        const newTab: WorkspaceTab = {
          id: `tab-${Date.now()}`,
          companyId,
          searchTerm: "",
        };
        setWorkspaceTabs([...workspaceTabs, newTab]);
        setActiveTab(newTab.id);
      } else {
        setActiveTab(existingTab.id);
      }
    }
  };

  const handleCloseTab = (tabId: string) => {
    const newTabs = workspaceTabs.filter(tab => tab.id !== tabId);
    setWorkspaceTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(newTabs[0]?.id || null);
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <WorkspaceHeader
          companies={companies}
          selectedCompany={activeTab ? workspaceTabs.find((tab) => tab.id === activeTab)?.companyId || null : null}
          onSelectCompany={handleCompanySelect}
        />

        {workspaceTabs.length > 0 && (
          <Tabs 
            value={activeTab || undefined} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <WorkspaceTabs
              tabs={workspaceTabs}
              companies={companies}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onCloseTab={handleCloseTab}
              onSearchChange={(tabId: string, searchTerm: string) => {
                setWorkspaceTabs(
                  workspaceTabs.map((tab) =>
                    tab.id === tabId ? { ...tab, searchTerm } : tab
                  )
                );
              }}
              getFilteredCredentials={(companyId: string, searchTerm: string) => {
                if (!credentials) return [];
                return credentials.filter(cred => 
                  cred.title.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }}
              onCredentialsGenerated={(newCredentials: any[]) => {
                console.log('New credentials:', newCredentials);
              }}
              onEdit={handleEdit}
            />
          </Tabs>
        )}
      </div>

      <Dialog open={!!editingCredential} onOpenChange={() => setEditingCredential(null)}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Credencial</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 px-1">
            {editingCredential && (
              <EditCredentialForm
                initialData={editingCredential}
                onSubmit={handleEditSubmit}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;