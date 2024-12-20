import { useState } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { useCredentials } from "@/hooks/useCredentials";

interface WorkspaceTab {
  id: string;
  companyId: string;
  searchTerm: string;
}

interface WorkspaceContextProps {
  children: (props: {
    workspaceTabs: WorkspaceTab[];
    activeTab: string | null;
    companies: any[];
    credentials: any[];
    editingCredential: any | null;
    handleCompanySelect: (companyId: string) => void;
    handleTabChange: (tabId: string) => void;
    handleCloseTab: (tabId: string) => void;
    handleSearchChange: (tabId: string, searchTerm: string) => void;
    handleEdit: () => void;
    handleEditSubmit: (updatedData: any) => Promise<void>;
    handleEditClose: () => void;
  }) => React.ReactNode;
}

export const WorkspaceProvider = ({ children }: WorkspaceContextProps) => {
  const [workspaceTabs, setWorkspaceTabs] = useState<WorkspaceTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [editingCredential, setEditingCredential] = useState<any>(null);

  const { companies } = useCompanies();
  const { credentials, updateCredential } = useCredentials(
    activeTab ? workspaceTabs.find((tab) => tab.id === activeTab)?.companyId : undefined
  );

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

  const handleSearchChange = (tabId: string, searchTerm: string) => {
    setWorkspaceTabs(
      workspaceTabs.map((tab) =>
        tab.id === tabId ? { ...tab, searchTerm } : tab
      )
    );
  };

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

  return children({
    workspaceTabs,
    activeTab,
    companies,
    credentials,
    editingCredential,
    handleCompanySelect,
    handleTabChange: setActiveTab,
    handleCloseTab,
    handleSearchChange,
    handleEdit,
    handleEditSubmit,
    handleEditClose: () => setEditingCredential(null),
  });
};