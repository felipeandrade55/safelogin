export interface Flag {
  id: string;
  name: string;
  color: string;
}

export const defaultFlags: Flag[] = [
  { id: 'flag_1', name: 'Monitoramento', color: 'bg-blue-500' },
  { id: 'flag_2', name: 'FTTH', color: 'bg-green-500' },
  { id: 'flag_3', name: 'Redes', color: 'bg-yellow-500' },
  { id: 'flag_4', name: 'Geral', color: 'bg-gray-500' },
  { id: 'flag_5', name: 'OLT', color: 'bg-red-500' },
  { id: 'flag_6', name: 'Roteador', color: 'bg-purple-500' },
  { id: 'flag_7', name: 'Switch', color: 'bg-indigo-500' },
  { id: 'flag_8', name: 'Servidor', color: 'bg-orange-500' },
  { id: 'flag_9', name: 'Site', color: 'bg-teal-500' },
  { id: 'flag_10', name: 'Licença', color: 'bg-pink-500' },
];

// Load flags from localStorage or use defaults
export const loadFlags = (): Flag[] => {
  const savedFlags = localStorage.getItem('customFlags');
  return savedFlags ? JSON.parse(savedFlags) : defaultFlags;
};

// Save flags to localStorage
export const saveFlags = (flags: Flag[]) => {
  localStorage.setItem('customFlags', JSON.stringify(flags));
};