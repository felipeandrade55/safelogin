const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const analyzeDocument = async (content: string) => {
  const apiKey = localStorage.getItem("openai_api_key");
  if (!apiKey) {
    throw new Error("API key não configurada");
  }

  const prompt = `
    Analise o seguinte documento e extraia todas as credenciais de acesso encontradas.
    Retorne apenas um array JSON válido (sem marcadores markdown) com objetos contendo:
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
      throw new Error("Erro ao comunicar com a API da OpenAI");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Remove possíveis marcadores markdown e espaços extras
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    console.log('Conteúdo limpo:', cleanContent);
    
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