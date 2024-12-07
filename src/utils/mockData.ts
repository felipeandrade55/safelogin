import { v4 as uuidv4 } from 'uuid';

const MOCK_DATA_KEY = 'mockCredentials';

export const loadMockData = () => {
  const mockData = {
    // Example mock data structure
    'company1': [
      {
        id: uuidv4(),
        title: 'Credential 1',
        credentials: [
          { type: 'API Key', value: '12345', username: 'user1', password: 'pass1' },
        ],
        flags: [],
        files: [],
      },
    ],
  };
  localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(mockData));
};

export const removeMockData = () => {
  localStorage.removeItem(MOCK_DATA_KEY);
};

export const isMockDataLoaded = () => {
  return !!localStorage.getItem(MOCK_DATA_KEY);
};

export const getMockCompanies = () => {
  return [
    { id: 'company1', name: 'Company 1' },
    { id: 'company2', name: 'Company 2' },
  ];
};

export const getMockCredentials = () => {
  const data = localStorage.getItem(MOCK_DATA_KEY);
  return data ? JSON.parse(data) : {};
};

export const updateMockCredential = (companyId: string, credentialId: string, updatedData: any) => {
  const mockCredentials = getMockCredentials();
  
  if (mockCredentials[companyId]) {
    const updatedCredentials = mockCredentials[companyId].map(cred => 
      cred.id === credentialId ? { ...cred, ...updatedData } : cred
    );
    
    mockCredentials[companyId] = updatedCredentials;
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(mockCredentials));
  }
};