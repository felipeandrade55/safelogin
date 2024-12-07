import { toast } from "@/components/ui/use-toast";

export interface MockCompany {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  responsible: string;
  description: string;
}

export interface MockCredentialGroup {
  id: string;
  title: string;
  credentials: Array<{
    type: string;
    value: string;
    userCredentials: Array<{
      username?: string;
      password?: string;
    }>;
  }>;
}

export interface MockData {
  companies: MockCompany[];
  credentialsByCompany: {
    [key: string]: MockCredentialGroup[];
  };
}

const mockData: MockData = {
  companies: [
    {
      id: "company_garra",
      name: "Garra Telecom",
      cnpj: "12.345.678/0001-01",
      address: "Av. Principal, 1000, Centro, São Paulo - SP",
      phone: "(11) 3333-4444",
      email: "contato@garratel.com.br",
      responsible: "João Silva",
      description: "Provedor de internet e telefonia",
    },
    {
      id: "company_addax",
      name: "Addax Telecom",
      cnpj: "23.456.789/0001-02",
      address: "Rua das Flores, 500, Jardim, Rio de Janeiro - RJ",
      phone: "(21) 4444-5555",
      email: "contato@addaxtel.com.br",
      responsible: "Maria Santos",
      description: "Soluções em telecomunicações",
    },
    {
      id: "company_pgnet",
      name: "PGNET",
      cnpj: "34.567.890/0001-03",
      address: "Rua do Comércio, 200, Centro, Belo Horizonte - MG",
      phone: "(31) 5555-6666",
      email: "contato@pgnet.com.br",
      responsible: "Pedro Oliveira",
      description: "Internet fibra óptica",
    },
    {
      id: "company_turbonet",
      name: "Turbonet",
      cnpj: "45.678.901/0001-04",
      address: "Av. da Tecnologia, 300, Industrial, Curitiba - PR",
      phone: "(41) 6666-7777",
      email: "contato@turbonet.com.br",
      responsible: "Ana Costa",
      description: "Internet de alta velocidade",
    },
    {
      id: "company_r2",
      name: "R2 Dados",
      cnpj: "56.789.012/0001-05",
      address: "Rua da Inovação, 400, Tech Park, Salvador - BA",
      phone: "(71) 7777-8888",
      email: "contato@r2dados.com.br",
      responsible: "Carlos Mendes",
      description: "Soluções em dados e conectividade",
    },
  ],
  credentialsByCompany: {
    company_garra: [
      {
        id: "cred_garra_01",
        title: "Acessos Administrativos",
        credentials: [
          {
            type: "URL",
            value: "https://admin.garratel.com.br",
            userCredentials: [{
              username: "admin",
              password: "garra@2024"
            }]
          },
          {
            type: "SSH",
            value: "srv01.garratel.com.br",
            userCredentials: [{
              username: "root",
              password: "garra#srv01"
            }]
          },
        ],
      },
      {
        id: "cred_garra_02",
        title: "Portais de Atendimento",
        credentials: [
          {
            type: "URL",
            value: "https://suporte.garratel.com.br",
            userCredentials: [{
              username: "suporte",
              password: "sup@garra2024"
            }]
          },
        ],
      },
    ],
    company_addax: [
      {
        id: "cred_addax_01",
        title: "Sistema de Monitoramento",
        credentials: [
          {
            type: "URL",
            value: "https://monitor.addaxtel.com.br",
            userCredentials: [{
              username: "monitor",
              password: "addax@mon24"
            }]
          },
        ],
      },
    ],
    company_pgnet: [
      {
        id: "cred_pgnet_01",
        title: "Gestão de Rede",
        credentials: [
          {
            type: "URL",
            value: "https://network.pgnet.com.br",
            userCredentials: [{
              username: "netadmin",
              password: "pg@net2024"
            }]
          },
          {
            type: "API",
            value: "https://api.pgnet.com.br",
            userCredentials: [{
              username: "apiuser",
              password: "api@pg2024"
            }]
          },
        ],
      },
    ],
    company_turbonet: [
      {
        id: "cred_turbo_01",
        title: "Painéis de Controle",
        credentials: [
          {
            type: "URL",
            value: "https://painel.turbonet.com.br",
            userCredentials: [{
              username: "admin",
              password: "turbo@2024"
            }]
          },
        ],
      },
    ],
    company_r2: [
      {
        id: "cred_r2_01",
        title: "Sistemas Internos",
        credentials: [
          {
            type: "URL",
            value: "https://sistemas.r2dados.com.br",
            userCredentials: [{
              username: "admin",
              password: "r2@dados24"
            }]
          },
          {
            type: "SSH",
            value: "192.168.1.100",
            userCredentials: [{
              username: "admin",
              password: "r2@srv2024"
            }]
          },
        ],
      },
    ],
  },
};

// Function to load mock data
export const loadMockData = () => {
  localStorage.setItem('mockCompanies', JSON.stringify(mockData.companies));
  localStorage.setItem('mockCredentials', JSON.stringify(mockData.credentialsByCompany));
  toast({
    title: "Dados de teste carregados",
    description: "Os dados fictícios foram carregados com sucesso.",
  });
};

// Function to remove mock data
export const removeMockData = () => {
  localStorage.removeItem('mockCompanies');
  localStorage.removeItem('mockCredentials');
  toast({
    title: "Dados de teste removidos",
    description: "Os dados fictícios foram removidos com sucesso.",
  });
};

// Function to check if mock data is loaded
export const isMockDataLoaded = () => {
  return !!localStorage.getItem('mockCompanies');
};

// Function to get mock companies
export const getMockCompanies = () => {
  const companies = localStorage.getItem('mockCompanies');
  return companies ? JSON.parse(companies) : [];
};

// Function to get mock credentials
export const getMockCredentials = () => {
  const credentials = localStorage.getItem('mockCredentials');
  return credentials ? JSON.parse(credentials) : {};
};
