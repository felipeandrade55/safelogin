const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const analyzeDocument = async (content: string) => {
  const apiKey = localStorage.getItem("openai_api_key");
  if (!apiKey) {
    throw new Error("API key não configurada");
  }

  const prompt = `
    Analise o seguinte documento e extraia todas as credenciais de acesso encontradas.
    Formate a saída como um array JSON com objetos contendo:
    - title: título descritivo do conjunto de credenciais
    - credentials: array de objetos com type (URL/IP/etc), value, username e password

    Documento:
    ${content}
  `;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um assistente especializado em extrair informações de credenciais de documentos.",
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
      throw new Error("Erro ao comunicar com a API da OpenAI");
    }

    const data = await response.json();
    const parsedContent = JSON.parse(data.choices[0].message.content);
    return parsedContent;
  } catch (error) {
    console.error("Erro ao analisar documento:", error);
    throw error;
  }
};