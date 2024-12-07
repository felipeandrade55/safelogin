import { Input } from "@/components/ui/input";
import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { FileUploadCard } from "@/components/FileUploadCard";
import { CredentialCard } from "@/components/CredentialCard";
import { NotesCard } from "@/components/NotesCard";
import { toast } from "@/components/ui/use-toast";
import { moveToTrash } from "@/utils/trashUtils";
import { getMockCompanies } from "@/utils/mockData";

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
  const handleDelete = (credential: any, companyId: string) => {
    const companies = getMockCompanies();
    const company = companies.find((c) => c.id === companyId);
    if (company) {
      moveToTrash(credential, companyId, company.name);
      
      // Atualiza o localStorage
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder="Pesquisar credenciais..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
        <AddCredentialDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FileUploadCard onCredentialsGenerated={onCredentialsGenerated} />
        {credentials.map((credential) => (
          <CredentialCard
            key={credential.id}
            title={credential.title}
            cardType={credential.cardType}
            credentials={credential.credentials}
            files={credential.files}
            flags={credential.flags || []}
            onFlagChange={(newFlags) => handleFlagChange(credential.id, newFlags)}
            onEdit={() => {}} // Será implementado depois
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