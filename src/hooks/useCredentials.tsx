import { useState } from "react";

interface Credential {
  type: string;
  value: string;
  username?: string;
  password?: string;
}

interface CredentialGroup {
  id: string;
  title: string;
  credentials: Credential[];
}

interface CredentialsByCompany {
  [key: string]: CredentialGroup[];
}

export const useCredentials = () => {
  const [credentialsByCompany, setCredentialsByCompany] = useState<CredentialsByCompany>({
    company_01: [
      {
        id: "cred_01HNYG8J5N1X2P3Q4R5T6Y7Z8",
        title: "Gmail Trabalho",
        credentials: [
          {
            type: "URL",
            value: "https://gmail.com",
            username: "usuario@empresa.com",
            password: "senha123",
          },
          {
            type: "URL",
            value: "https://mail.google.com",
            username: "usuario@empresa.com",
            password: "senha123",
          },
        ],
      },
    ],
    company_02: [
      {
        id: "cred_01HNYGB2M3N4P5Q6R7S8T9U0V",
        title: "Sistema Interno",
        credentials: [
          {
            type: "URL",
            value: "https://sistema.empresa.com",
            username: "admin",
            password: "admin123",
          },
          {
            type: "SSH",
            value: "192.168.1.100",
            username: "root",
            password: "root123",
          },
          {
            type: "API",
            value: "https://api.sistema.empresa.com",
            username: "apikey",
            password: "chave-secreta-123",
          },
        ],
      },
    ],
  });

  const addCredentials = (companyId: string, newCredentials: Array<{
    title: string;
    credentials: Credential[];
  }>) => {
    setCredentialsByCompany(prev => ({
      ...prev,
      [companyId]: [
        ...(prev[companyId] || []),
        ...newCredentials.map(cred => ({
          ...cred,
          id: `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })),
      ],
    }));
  };

  return {
    credentialsByCompany,
    addCredentials,
  };
};