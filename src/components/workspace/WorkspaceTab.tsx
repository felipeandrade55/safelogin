import { Input } from "@/components/ui/input";
import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { FileUploadCard } from "@/components/FileUploadCard";
import { NotesCard } from "@/components/NotesCard";
import { toast } from "@/components/ui/use-toast";
import { moveToTrash } from "@/utils/trashUtils";
import { getMockCompanies } from "@/utils/mockData";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { FilterBar } from "./FilterBar";
import { CredentialGroup } from "./CredentialGroup";
import { useIsMobile } from "@/hooks/use-mobile";

interface Credential {
  id: string;
  title: string;
  cardType: string;
  credentials: any[];
  flags?: string[];
  files?: any[];
}

interface GroupedCredentials {
  [key: string]: Credential[];
}

interface WorkspaceTabProps {
  companyId: string;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  credentials: Credential[];
  onCredentialsGenerated: (credentials: Credential[]) => void;
  onEdit?: (credential: Credential) => void;
}

export const WorkspaceTab = ({
  companyId,
  searchTerm,
  onSearchChange,
  credentials,
  onCredentialsGenerated,
  onEdit,
}: WorkspaceTabProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  const availableTypes = Array.from(
    new Set(credentials.map((cred) => cred.cardType))
  ).sort();

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleFlagToggle = (flagId: string) => {
    setSelectedFlags((prev) =>
      prev.includes(flagId)
        ? prev.filter((f) => f !== flagId)
        : [...prev, flagId]
    );
  };

  const filteredCredentials = credentials.filter((credential) => {
    const matchesSearch = credential.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTypes.length > 0 && !selectedTypes.includes(credential.cardType)) {
      return false;
    }

    if (selectedFlags.length > 0) {
      const credentialFlags = credential.flags || [];
      if (!selectedFlags.some(flag => credentialFlags.includes(flag))) {
        return false;
      }
    }

    return true;
  });

  const groupedCredentials: GroupedCredentials = filteredCredentials.reduce((groups, credential) => {
    const group = credential.cardType || "Outros";
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(credential);
    return groups;
  }, {} as GroupedCredentials);

  const handleDelete = useCallback((credential: Credential, companyId: string) => {
    const companies = getMockCompanies();
    const company = companies.find((c) => c.id === companyId);
    if (company) {
      moveToTrash(credential, companyId, company.name);
      
      const currentCredentials = JSON.parse(localStorage.getItem('mockCredentials') || '{}');
      currentCredentials[companyId] = currentCredentials[companyId].filter(
        (c: any) => c.id !== credential.id
      );
      localStorage.setItem('mockCredentials', JSON.stringify(currentCredentials));
      
      toast({
        title: "Credencial Movida para Lixeira",
        description: "A credencial foi movida para a lixeira e pode ser restaurada em até 90 dias.",
      });
    }
  }, []);

  const handleAddFile = useCallback((credentialId: string, file: File) => {
    const newFile = {
      id: `file_${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    };

    const updatedCredentials = JSON.parse(localStorage.getItem('mockCredentials') || '{}');
    
    if (companyId) {
      updatedCredentials[companyId] = updatedCredentials[companyId].map((cred: Credential) => 
        cred.id === credentialId 
          ? { ...cred, files: [...(cred.files || []), newFile] }
          : cred
      );
      
      localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
      toast({
        description: "Arquivo anexado com sucesso",
      });
    }
  }, [companyId]);

  const handleRemoveFile = useCallback((credentialId: string, fileId: string) => {
    const updatedCredentials = JSON.parse(localStorage.getItem('mockCredentials') || '{}');
    
    if (companyId) {
      updatedCredentials[companyId] = updatedCredentials[companyId].map((cred: Credential) => 
        cred.id === credentialId 
          ? { ...cred, files: (cred.files || []).filter((f: any) => f.id !== fileId) }
          : cred
      );
      
      localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
      toast({
        description: "Arquivo removido com sucesso",
      });
    }
  }, [companyId]);

  const handleRenameFile = useCallback((credentialId: string, fileId: string, newName: string) => {
    const updatedCredentials = JSON.parse(localStorage.getItem('mockCredentials') || '{}');
    
    if (companyId) {
      updatedCredentials[companyId] = updatedCredentials[companyId].map((cred: Credential) => 
        cred.id === credentialId 
          ? {
              ...cred,
              files: (cred.files || []).map((f: any) => 
                f.id === fileId ? { ...f, name: newName } : f
              )
            }
          : cred
      );
      
      localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
    }
  }, [companyId]);

  const handleFlagChange = useCallback((credentialId: string, newFlags: string[]) => {
    const updatedCredentials = JSON.parse(localStorage.getItem('mockCredentials') || '{}');
    updatedCredentials[companyId] = updatedCredentials[companyId].map((cred: Credential) => 
      cred.id === credentialId 
        ? { ...cred, flags: newFlags }
        : cred
    );
    
    localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
  }, [companyId]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, 150),
    [onSearchChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    debouncedSearch(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
          <Input
            type="search"
            placeholder="Pesquisar credenciais..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:max-w-md"
          />
          <FilterBar
            selectedTypes={selectedTypes}
            selectedFlags={selectedFlags}
            onTypeToggle={handleTypeToggle}
            onFlagToggle={handleFlagToggle}
            availableTypes={availableTypes}
          />
        </div>
        <AddCredentialDialog />
      </div>

      <div className="grid gap-6">
        <FileUploadCard onCredentialsGenerated={onCredentialsGenerated} />
        
        <div className="space-y-8">
          {Object.entries(groupedCredentials)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([group, credentials]) => (
              <CredentialGroup
                key={group}
                title={group}
                credentials={credentials}
                companyId={companyId}
                onEdit={onEdit}
                onDelete={handleDelete}
                onAddFile={handleAddFile}
                onRemoveFile={handleRemoveFile}
                onRenameFile={handleRenameFile}
                onFlagChange={handleFlagChange}
              />
            ))}
        </div>
      </div>

      <div className="mt-8">
        <NotesCard companyId={companyId} />
      </div>
    </div>
  );
};