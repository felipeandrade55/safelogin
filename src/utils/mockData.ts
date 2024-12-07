import { v4 as uuidv4 } from 'uuid';

const MOCK_DATA_KEY = 'mockCredentials';
const MOCK_COMPANIES_KEY = 'mockCompanies';

export const loadMockData = () => {
  const mockCompanies = [
    { id: 'company1', name: 'Empresa de Teste 1' },
    { id: 'company2', name: 'Empresa de Teste 2' },
    { id: 'company3', name: 'Empresa de Teste 3' },
  ];

  const mockCredentials = {
    company1: [
      {
        id: uuidv4(),
        title: 'Servidor Principal',
        cardType: 'Servidor',
        credentials: [
          { 
            type: 'SSH',
            value: '192.168.1.100',
            userCredentials: [
              { username: 'admin', password: 'senha123' }
            ]
          }
        ],
        flags: ['importante', 'producao'],
        files: [],
      },
      {
        id: uuidv4(),
        title: 'Roteador Edge',
        cardType: 'Roteador',
        credentials: [
          {
            type: 'Web',
            value: '10.0.0.1',
            userCredentials: [
              { username: 'admin', password: 'router123' }
            ]
          }
        ],
        flags: ['rede'],
        files: [],
      }
    ],
    company2: [
      {
        id: uuidv4(),
        title: 'Switch Core',
        cardType: 'Switch',
        credentials: [
          {
            type: 'Telnet',
            value: '192.168.0.254',
            userCredentials: [
              { username: 'admin', password: 'switch123' }
            ]
          }
        ],
        flags: ['rede', 'importante'],
        files: [],
      }
    ],
    company3: [
      {
        id: uuidv4(),
        title: 'OLT Principal',
        cardType: 'OLT',
        credentials: [
          {
            type: 'SNMP',
            value: '172.16.0.100',
            userCredentials: [
              { username: 'snmpuser', password: 'community123' }
            ]
          }
        ],
        flags: ['fibra'],
        files: [],
      },
      {
        id: uuidv4(),
        title: 'Anotações Gerais',
        cardType: 'Anotação',
        credentials: [
          {
            type: 'text',
            value: 'Lembrar de fazer backup diário dos equipamentos.',
            userCredentials: []
          }
        ],
        flags: [],
        files: [],
      }
    ]
  };

  localStorage.setItem(MOCK_COMPANIES_KEY, JSON.stringify(mockCompanies));
  localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(mockCredentials));
};

export const removeMockData = () => {
  localStorage.removeItem(MOCK_DATA_KEY);
  localStorage.removeItem(MOCK_COMPANIES_KEY);
};

export const isMockDataLoaded = () => {
  return !!localStorage.getItem(MOCK_DATA_KEY) && !!localStorage.getItem(MOCK_COMPANIES_KEY);
};

export const getMockCompanies = () => {
  const companies = localStorage.getItem(MOCK_COMPANIES_KEY);
  return companies ? JSON.parse(companies) : [];
};

export const getMockCredentials = () => {
  const data = localStorage.getItem(MOCK_DATA_KEY);
  return data ? JSON.parse(data) : {};
};

export const updateMockCredential = (companyId: string, credentialId: string, updatedData: any) => {
  const mockCredentials = getMockCredentials();
  
  if (mockCredentials[companyId]) {
    const updatedCredentials = mockCredentials[companyId].map((cred: any) => 
      cred.id === credentialId ? { ...cred, ...updatedData } : cred
    );
    
    mockCredentials[companyId] = updatedCredentials;
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(mockCredentials));
  }
};