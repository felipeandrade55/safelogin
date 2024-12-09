import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

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

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          <div className="flex items-center justify-between p-4 border-b">
            <Input
              type="text"
              placeholder="Search..."
              value={tab.searchTerm}
              onChange={(e) => onSearchChange(tab.id, e.target.value)}
              className="flex-1"
            />
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onEdit}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => onCloseTab(tab.id)}>
                Delete
              </Button>
            </div>
          </div>
        </TabsContent>
      ))}
    </>
  );
};