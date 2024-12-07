import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { CredentialCard } from "@/components/CredentialCard";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditCredentialForm } from "@/components/EditCredentialForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CompanySelect } from "@/components/CompanySelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FileUploadCard } from "@/components/FileUploadCard";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useCredentials } from "@/hooks/useCredentials";
import { useToast } from "@/components/ui/use-toast";
import { NotesCard } from "@/components/NotesCard";
import { 
  loadMockData, 
  removeMockData, 
  isMockDataLoaded, 
  getMockCompanies, 
  getMockCredentials 
} from "@/utils/mockData";
import { moveToTrash } from "@/utils/trashUtils";

interface WorkspaceTab {
  id: string;
  companyId: string;
  searchTerm: string;
}

const Index = () => {
  const [workspaceTabs, setWorkspaceTabs] = useState<WorkspaceTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<{
    id: string;
    title: string;
    credentials: Array<{
      type: string;
      value: string;
      username?: string;
      password?: string;
    }>;
  } | null>(null);
  
  const { credentialsByCompany, addCredentials } = useCredentials();
  const { toast } = useToast();

  // Load mock data on component mount if not already loaded
  useEffect(() => {
    if (!isMockDataLoaded()) {
      loadMockData();
    }
  }, []);

  const companies = getMockCompanies();
  const mockCredentials = getMockCredentials();

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

  const handleEdit = (credential: typeof credentialsByCompany[keyof typeof credentialsByCompany][0]) => {
    setEditingCard(credential);
  };

  const onSubmitEdit = (values: {
    title: string;
    credentials: Array<{
      type: string;
      value: string;
      username?: string;
      password?: string;
    }>;
  }) => {
    console.log("Editando credencial:", editingCard?.id, values);
    setEditingCard(null);
  };

  const getFilteredCredentials = (companyId: string, searchTerm: string) => {
    const credentials = mockCredentials[companyId] || [];
    return credentials.filter((credential) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        credential.title.toLowerCase().includes(searchLower) ||
        credential.credentials.some(
          (cred) =>
            cred.type.toLowerCase().includes(searchLower) ||
            cred.value.toLowerCase().includes(searchLower) ||
            (cred.username && cred.username.toLowerCase().includes(searchLower))
        )
      );
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
      toast({
        title: "Erro",
        description: "Selecione uma empresa antes de fazer upload de credenciais.",
        variant: "destructive",
      });
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
    
    // Force a re-render by updating the state
    setWorkspaceTabs(prev => [...prev]);

    toast({
      title: "Sucesso",
      description: `${newCredentials.length} grupos de credenciais foram adicionados.`,
    });
  };

  const handleDelete = (credential: any, companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    if (company) {
      moveToTrash(credential, companyId, company.name);
      
      // Remove from current credentials
      const updatedCredentials = { ...mockCredentials };
      updatedCredentials[companyId] = updatedCredentials[companyId].filter(
        (c: any) => c.id !== credential.id
      );
      localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
      
      toast({
        title: "Credencial Movida para Lixeira",
        description: "A credencial foi movida para a lixeira e pode ser restaurada em até 90 dias.",
      });
    }
  };

  const handleAddFile = (credentialId: string, file: File) => {
    // Simula o upload do arquivo
    const newFile = {
      id: `file_${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    };

    // Atualiza o mockData
    const updatedCredentials = { ...mockCredentials };
    const company = workspaceTabs.find(tab => tab.id === activeTab)?.companyId;
    
    if (company) {
      updatedCredentials[company] = updatedCredentials[company].map(cred => 
        cred.id === credentialId 
          ? { ...cred, files: [...(cred.files || []), newFile] }
          : cred
      );
      
      localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
      toast({
        description: "Arquivo anexado com sucesso",
      });
    }
  };

  const handleRemoveFile = (credentialId: string, fileId: string) => {
    const updatedCredentials = { ...mockCredentials };
    const company = workspaceTabs.find(tab => tab.id === activeTab)?.companyId;
    
    if (company) {
      updatedCredentials[company] = updatedCredentials[company].map(cred => 
        cred.id === credentialId 
          ? { ...cred, files: (cred.files || []).filter(f => f.id !== fileId) }
          : cred
      );
      
      localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
      toast({
        description: "Arquivo removido com sucesso",
      });
    }
  };

  const handleRenameFile = (credentialId: string, fileId: string, newName: string) => {
    const updatedCredentials = { ...mockCredentials };
    const company = workspaceTabs.find(tab => tab.id === activeTab)?.companyId;
    
    if (company) {
      updatedCredentials[company] = updatedCredentials[company].map(cred => 
        cred.id === credentialId 
          ? {
              ...cred,
              files: (cred.files || []).map(f => 
                f.id === fileId ? { ...f, name: newName } : f
              )
            }
          : cred
      );
      
      localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
    }
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
            <SettingsDialog />
          </div>
        </div>

        <CompanySelect
          companies={companies}
          selectedCompany={activeTab ? workspaceTabs.find((tab) => tab.id === activeTab)?.companyId || null : null}
          onSelectCompany={handleCompanySelect}
        />

        {workspaceTabs.length > 0 && (
          <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start">
              {workspaceTabs.map((tab) => {
                const company = companies.find((c) => c.id === tab.companyId);
                return (
                  <div key={tab.id} className="flex items-center">
                    <TabsTrigger value={tab.id} className="flex items-center gap-2">
                      {company?.name}
                    </TabsTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCloseTab(tab.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </TabsList>

            {workspaceTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Input
                      type="search"
                      placeholder="Pesquisar credenciais..."
                      value={tab.searchTerm}
                      onChange={(e) => handleSearchChange(tab.id, e.target.value)}
                      className="max-w-md"
                    />
                    <AddCredentialDialog />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FileUploadCard onCredentialsGenerated={handleCredentialsFromUpload} />
                    {getFilteredCredentials(tab.companyId, tab.searchTerm).map((credential) => (
                      <CredentialCard
                        key={credential.id}
                        title={credential.title}
                        cardType={credential.cardType}
                        credentials={credential.credentials}
                        files={credential.files}
                        onEdit={() => handleEdit(credential)}
                        onDelete={() => handleDelete(credential, tab.companyId)}
                        onAddFile={(file) => handleAddFile(credential.id, file)}
                        onRemoveFile={(fileId) => handleRemoveFile(credential.id, fileId)}
                        onRenameFile={(fileId, newName) => handleRenameFile(credential.id, fileId, newName)}
                      />
                    ))}
                  </div>

                  <div className="mt-8">
                    <NotesCard companyId={tab.companyId} />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Credencial</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 px-1">
            {editingCard && (
              <EditCredentialForm
                initialData={{
                  title: editingCard.title,
                  credentials: editingCard.credentials,
                }}
                onSubmit={onSubmitEdit}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
