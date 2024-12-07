import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CompanySelect } from "@/components/CompanySelect";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCredentials } from "@/hooks/useCredentials";
import { EditCredentialForm } from "@/components/EditCredentialForm";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { 
  loadMockData, 
  removeMockData, 
  isMockDataLoaded, 
  getMockCompanies, 
  getMockCredentials,
  updateMockCredential 
} from "@/utils/mockData";
import { loadFlags } from "@/utils/flagsData";

interface WorkspaceTab {
  id: string;
  companyId: string;
  searchTerm: string;
}

const Index = () => {
  const [workspaceTabs, setWorkspaceTabs] = useState<WorkspaceTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [editingCredential, setEditingCredential] = useState<any>(null);
  
  const { credentialsByCompany, addCredentials } = useCredentials();

  useEffect(() => {
    if (!isMockDataLoaded()) {
      loadMockData();
    }
  }, []);

  const companies = getMockCompanies();
  const mockCredentials = getMockCredentials();

  const handleEdit = (credential: any) => {
    setEditingCredential(credential);
  };

  const handleEditSubmit = (updatedData: any) => {
    if (editingCredential) {
      const currentCompanyId = workspaceTabs.find(tab => tab.id === activeTab)?.companyId;
      if (currentCompanyId) {
        updateMockCredential(currentCompanyId, editingCredential.id, {
          ...editingCredential,
          ...updatedData
        });
        setEditingCredential(null);
        // Force a re-render
        setWorkspaceTabs(prev => [...prev]);
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

  const handleSearchChange = (tabId: string, searchTerm: string) => {
    setWorkspaceTabs(
      workspaceTabs.map((tab) =>
        tab.id === tabId ? { ...tab, searchTerm } : tab
      )
    );
  };

  const handleCloseTab = (tabId: string) => {
    const newTabs = workspaceTabs.filter((tab) => tab.id !== tabId);
    setWorkspaceTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(newTabs.length ? newTabs[newTabs.length - 1].id : null);
    }
  };

  const getFilteredCredentials = (companyId: string, searchTerm: string) => {
    console.log("Buscando credenciais para empresa:", companyId);
    console.log("Termo de busca:", searchTerm);
    
    const credentials = mockCredentials[companyId] || [];
    console.log("Credenciais encontradas:", credentials);
    
    if (!searchTerm) return credentials;

    const searchLower = searchTerm.toLowerCase();
    
    return credentials.filter((credential) => {
      // Busca no título
      if (credential.title.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Busca nas flags
      if (credential.flags?.some(flagId => {
        const flag = loadFlags().find(f => f.id === flagId);
        return flag?.name.toLowerCase().includes(searchLower);
      })) {
        return true;
      }

      // Busca nos arquivos anexados
      if (credential.files?.some(file => 
        file.name.toLowerCase().includes(searchLower)
      )) {
        return true;
      }

      // Busca nas credenciais
      return credential.credentials.some(cred => {
        // Verifica todos os campos relevantes da credencial
        const fieldsToSearch = [
          cred.type,
          cred.value,
          cred.username,
          cred.password
        ].filter(Boolean);

        return fieldsToSearch.some(field => 
          field.toLowerCase().includes(searchLower)
        );
      });
    });
  };

  const handleCredentialsFromUpload = (newCredentials: Array<{
    title: string;
    credentials: Array<{
      type: string;
      value: string;
      username?: string;
      password?: string;
    }>;
  }>) => {
    const currentCompanyId = workspaceTabs.find(tab => tab.id === activeTab)?.companyId;
    
    if (!currentCompanyId) {
      return;
    }

    // Update mockCredentials in localStorage
    const currentCredentials = getMockCredentials();
    const updatedCredentials = {
      ...currentCredentials,
      [currentCompanyId]: [
        ...(currentCredentials[currentCompanyId] || []),
        ...newCredentials.map(cred => ({
          ...cred,
          id: `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })),
      ],
    };
    
    localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
    
    // Force a re-render
    setWorkspaceTabs(prev => [...prev]);
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Minhas Credenciais</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                if (isMockDataLoaded()) {
                  removeMockData();
                } else {
                  loadMockData();
                }
              }}
            >
              {isMockDataLoaded() ? "Remover Dados de Teste" : "Carregar Dados de Teste"}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <CompanySelect
            companies={companies}
            selectedCompany={activeTab ? workspaceTabs.find((tab) => tab.id === activeTab)?.companyId || null : null}
            onSelectCompany={handleCompanySelect}
          />
        </div>

        {workspaceTabs.length > 0 && (
          <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="w-full">
            <WorkspaceTabs
              tabs={workspaceTabs}
              companies={companies}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onCloseTab={handleCloseTab}
              onSearchChange={handleSearchChange}
              getFilteredCredentials={getFilteredCredentials}
              onCredentialsGenerated={handleCredentialsFromUpload}
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
