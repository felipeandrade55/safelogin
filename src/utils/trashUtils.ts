interface TrashedCredential {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  cardType: string;
  credentials: Array<{
    type: string;
    value: string;
    username?: string;
    password?: string;
    emailServer?: string;
    emailPort?: string;
    emailDescription?: string;
  }>;
  trashedAt: number;
}

const TRASH_STORAGE_KEY = 'credentialsTrash';
const DAYS_TO_KEEP = 90;

export const moveToTrash = (
  credential: any,
  companyId: string,
  companyName: string
) => {
  const trash = getTrashCredentials();
  
  const trashedCredential: TrashedCredential = {
    ...credential,
    companyId,
    companyName,
    trashedAt: Date.now(),
  };
  
  trash.push(trashedCredential);
  localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(trash));
  
  return trashedCredential;
};

export const getTrashCredentials = (): TrashedCredential[] => {
  const trash = localStorage.getItem(TRASH_STORAGE_KEY);
  return trash ? JSON.parse(trash) : [];
};

export const restoreFromTrash = (credentialId: string, companyId: string) => {
  const trash = getTrashCredentials();
  const credentialToRestore = trash.find(c => c.id === credentialId);
  
  if (credentialToRestore) {
    // Remove from trash
    const newTrash = trash.filter(c => c.id !== credentialId);
    localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(newTrash));
    
    // Add back to company credentials
    const companies = JSON.parse(localStorage.getItem('mockCompanies') || '[]');
    const companyIndex = companies.findIndex((c: any) => c.id === companyId);
    
    if (companyIndex !== -1) {
      const credentials = JSON.parse(localStorage.getItem('mockCredentials') || '{}');
      if (!credentials[companyId]) {
        credentials[companyId] = [];
      }
      
      const { trashedAt, companyId: _, companyName: __, ...restoredCredential } = credentialToRestore;
      credentials[companyId].push(restoredCredential);
      
      localStorage.setItem('mockCredentials', JSON.stringify(credentials));
    }
  }
};

export const clearExpiredTrash = () => {
  const trash = getTrashCredentials();
  const now = Date.now();
  const msInDays = DAYS_TO_KEEP * 24 * 60 * 60 * 1000;
  
  const validTrash = trash.filter(item => {
    const age = now - item.trashedAt;
    return age < msInDays;
  });
  
  localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(validTrash));
};

export const isInTrash = (credentialId: string): boolean => {
  const trash = getTrashCredentials();
  return trash.some(c => c.id === credentialId);
};