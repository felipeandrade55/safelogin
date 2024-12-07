import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { CredentialCard } from "@/components/CredentialCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";
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

const mockCompanies = [
  {
    id: "company_01",
    name: "Empresa A",
    description: "Tecnologia e Inovação",
  },
  {
    id: "company_02",
    name: "Empresa B",
    description: "Consultoria",
  },
];

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
    return credentialsByCompany[companyId]?.filter((credential) => {
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
    }) || [];
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

    addCredentials(currentCompanyId, newCredentials);
    toast({
      title: "Sucesso",
      description: `${newCredentials.length} grupos de credenciais foram adicionados.`,
    });
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Minhas Credenciais</h1>
          <SettingsDialog />
        </div>

        <CompanySelect
          companies={mockCompanies}
          selectedCompany={activeTab ? workspaceTabs.find((tab) => tab.id === activeTab)?.companyId || null : null}
          onSelectCompany={handleCompanySelect}
        />

        {workspaceTabs.length > 0 && (
          <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start">
              {workspaceTabs.map((tab) => {
                const company = mockCompanies.find((c) => c.id === tab.companyId);
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
                        credentials={credential.credentials}
                        onEdit={() => handleEdit(credential)}
                      />
                    ))}
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