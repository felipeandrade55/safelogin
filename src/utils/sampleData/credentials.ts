export const sampleCredentials = [
  {
    title: "Servidor Web Principal",
    card_type: "Servidor",
    access: [
      {
        type: "SSH",
        value: "192.168.1.100",
        userCredentials: [
          { username: "admin", password: "senha123" },
          { username: "root", password: "root123" }
        ]
      },
      {
        type: "HTTP",
        value: "https://servidor1.exemplo.com",
        userCredentials: [
          { username: "webadmin", password: "web123" }
        ]
      }
    ]
  },
  {
    title: "Roteador Core",
    card_type: "Equipamento",
    access: [
      {
        type: "SSH",
        value: "10.0.0.1",
        userCredentials: [
          { username: "network", password: "net123" }
        ]
      },
      {
        type: "HTTPS",
        value: "https://10.0.0.1",
        userCredentials: [
          { username: "admin", password: "router123" }
        ]
      }
    ]
  },
  {
    title: "Switch de Distribuição",
    card_type: "Equipamento",
    access: [
      {
        type: "Telnet",
        value: "192.168.1.254",
        userCredentials: [
          { username: "admin", password: "switch123" }
        ]
      }
    ]
  },
  {
    title: "Banco de Dados Principal",
    card_type: "Infraestrutura",
    access: [
      {
        type: "PostgreSQL",
        value: "postgres://localhost:5432",
        userCredentials: [
          { username: "postgres", password: "pg123" },
          { username: "readonly", password: "read123" }
        ]
      }
    ]
  }
];