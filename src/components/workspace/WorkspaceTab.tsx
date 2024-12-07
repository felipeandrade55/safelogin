import { Input } from "@/components/ui/input";
import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { FileUploadCard } from "@/components/FileUploadCard";
import { CredentialCard } from "@/components/CredentialCard";
import { NotesCard } from "@/components/NotesCard";
import { toast } from "@/components/ui/use-toast";
import { moveToTrash } from "@/utils/trashUtils";
import { getMockCompanies } from "@/utils/mockData";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { FilterBar } from "./FilterBar";

interface WorkspaceTabProps {
  companyId: string;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  credentials: any[];
  onCredentialsGenerated: (credentials: any[]) => void;
}

export const WorkspaceTab = ({
  companyId,
  searchTerm,
  onSearchChange,
  credentials,
  onCredentialsGenerated,
}: WorkspaceTabProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  
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
    // Aplica filtro por tipo se houver tipos selecionados
    if (selectedTypes.length > 0 && !selectedTypes.includes(credential.cardType)) {
      return false;
    }

    // Aplica filtro por flags se houver flags selecionadas
    if (selectedFlags.length > 0) {
      const credentialFlags = credential.flags || [];
      if (!selectedFlags.some(flag => credentialFlags.includes(flag))) {
        return false;
      }
    }

    return true;
  });

  const handleDelete = (credential: any, companyId: string) => {
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
  };

  const handleAddFile = (credentialId: string, file: File) => {
    const newFile = {
      id: `file_${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    };

    const updatedCredentials = JSON.parse(localStorage.getItem('mockCredentials') || '{}');
    
    if (companyId) {
      updatedCredentials[companyId] = updatedCredentials[companyId].map((cred: any) => 
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
    const updatedCredentials = JSON.parse(localStorage.getItem('mockCredentials') || '{}');
    
    if (companyId) {
      updatedCredentials[companyId] = updatedCredentials[companyId].map((cred: any) => 
        cred.id === credentialId 
          ? { ...cred, files: (cred.files || []).filter((f: any) => f.id !== fileId) }
          : cred
      );
      
      localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
      toast({
        description: "Arquivo removido com sucesso",
      });
    }
  };

  const handleRenameFile = (credentialId: string, fileId: string, newName: string) => {
    const updatedCredentials = JSON.parse(localStorage.getItem('mockCredentials') || '{}');
    
    if (companyId) {
      updatedCredentials[companyId] = updatedCredentials[companyId].map((cred: any) => 
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
  };

  const handleFlagChange = (credentialId: string, newFlags: string[]) => {
    const updatedCredentials = JSON.parse(localStorage.getItem('mockCredentials') || '{}');
    updatedCredentials[companyId] = updatedCredentials[companyId].map((cred: any) => 
      cred.id === credentialId 
        ? { ...cred, flags: newFlags }
        : cred
    );
    
    localStorage.setItem('mockCredentials', JSON.stringify(updatedCredentials));
  };

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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Input
            type="search"
            placeholder="Pesquisar credenciais..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-md"
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

      <div className="grid gap-6 md:grid-cols-2">
        <FileUploadCard onCredentialsGenerated={onCredentialsGenerated} />
        {filteredCredentials.map((credential) => (
          <CredentialCard
            key={credential.id}
            title={credential.title}
            cardType={credential.cardType}
            credentials={credential.credentials}
            files={credential.files}
            flags={credential.flags || []}
            onFlagChange={(newFlags) => handleFlagChange(credential.id, newFlags)}
            onEdit={() => {}}
            onDelete={() => handleDelete(credential, companyId)}
            onAddFile={(file) => handleAddFile(credential.id, file)}
            onRemoveFile={(fileId) => handleRemoveFile(credential.id, fileId)}
            onRenameFile={(fileId, newName) => handleRenameFile(credential.id, fileId, newName)}
          />
        ))}
      </div>

      <div className="mt-8">
        <NotesCard companyId={companyId} />
      </div>
    </div>
  );
};