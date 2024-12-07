const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Chave fixa da API
const API_KEY = "sk-your-fixed-api-key-here";

export const analyzeDocument = async (content: string) => {
  if (!API_KEY) {
    throw new Error("API key não configurada no sistema");
  }

  const prompt = `
    Analise o seguinte documento e extraia todas as credenciais de acesso encontradas.
    
    REGRAS IMPORTANTES:
    1. Quando encontrar uma linha que começa e termina com "#" (exemplo: "################### NOC CIRION #####################"):
       - Use o texto entre os "#" como título do próximo grupo de credenciais
       - Ignore os caracteres "#" no título
       - Todas as credenciais que vierem após esta linha devem ser agrupadas sob este título
       - Continue usando este título até encontrar outra linha com o mesmo padrão

    2. Para cada grupo de credenciais, retorne:
       - title: título extraído da linha com "#" ou título descritivo se não houver uma linha com "#"
       - credentials: array de objetos com type (URL/IP/etc), value, username e password

    Retorne apenas um array JSON válido (sem marcadores markdown).

    Documento:
    ${content}
  `;

  try {
    console.log("Iniciando análise com OpenAI...");
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um assistente especializado em extrair informações de credenciais de documentos. Retorne apenas JSON puro, sem formatação markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro da API OpenAI:", errorData);
      throw new Error("Erro ao comunicar com a API da OpenAI");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("Análise concluída com sucesso!");
    
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    console.log('Conteúdo processado:', cleanContent);
    
    try {
      return JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      console.log('Conteúdo que causou erro:', cleanContent);
      throw new Error("Formato de resposta inválido da API");
    }
  } catch (error) {
    console.error("Erro ao analisar documento:", error);
    throw error;
  }
};