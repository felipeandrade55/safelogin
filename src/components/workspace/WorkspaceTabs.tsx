import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CredentialGroup } from "./CredentialGroup";

interface WorkspaceTabsProps {
  tabs: Array<{
    id: string;
    companyId: string;
    searchTerm: string;
  }>;
  companies: Array<{
    id: string;
    name: string;
  }>;
  activeTab: string | null;
  onTabChange: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onSearchChange: (tabId: string, searchTerm: string) => void;
  getFilteredCredentials: (companyId: string, searchTerm: string) => any[];
  onCredentialsGenerated: (credentials: any[]) => void;
  onEdit: () => void;
}

export const WorkspaceTabs = ({
  tabs,
  companies,
  activeTab,
  onTabChange,
  onCloseTab,
  onSearchChange,
  getFilteredCredentials,
  onCredentialsGenerated,
  onEdit,
}: WorkspaceTabsProps) => {
  return (
    <>
      <TabsList className="w-full justify-start">
        {tabs.map((tab) => {
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
                  onCloseTab(tab.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </TabsList>

      {tabs.map((tab) => {
        const credentials = getFilteredCredentials(tab.companyId, tab.searchTerm);
        const equipmentCredentials = credentials.filter(
          (cred) => cred.cardType === "Equipamento"
        );
        const serverCredentials = credentials.filter(
          (cred) => cred.cardType === "Servidor"
        );
        const otherCredentials = credentials.filter(
          (cred) =>
            cred.cardType !== "Equipamento" && cred.cardType !== "Servidor"
        );

        return (
          <TabsContent key={tab.id} value={tab.id} className="mt-6 space-y-6">
            {equipmentCredentials.length > 0 && (
              <CredentialGroup
                title="Equipamentos"
                credentials={equipmentCredentials}
                companyId={tab.companyId}
                onEdit={onEdit}
              />
            )}
            {serverCredentials.length > 0 && (
              <CredentialGroup
                title="Servidores"
                credentials={serverCredentials}
                companyId={tab.companyId}
                onEdit={onEdit}
              />
            )}
            {otherCredentials.length > 0 && (
              <CredentialGroup
                title="Outros"
                credentials={otherCredentials}
                companyId={tab.companyId}
                onEdit={onEdit}
              />
            )}
          </TabsContent>
        );
      })}
    </>
  );
};