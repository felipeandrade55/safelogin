import { CredentialChange } from "@/types/history";
import { v4 as uuidv4 } from 'uuid';

const HISTORY_STORAGE_KEY = 'credentialHistory';
const MAX_HISTORY_ITEMS = 50;

export const addToHistory = (change: Omit<CredentialChange, 'id' | 'timestamp'>) => {
  const history: CredentialChange[] = JSON.parse(
    localStorage.getItem(HISTORY_STORAGE_KEY) || '[]'
  );

  const newChange: CredentialChange = {
    ...change,
    id: uuidv4(),
    timestamp: Date.now(),
  };

  history.unshift(newChange);
  
  // Mantém apenas os últimos MAX_HISTORY_ITEMS itens
  const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
  
  return newChange;
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
};

export const getHistory = (): CredentialChange[] => {
  return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
};