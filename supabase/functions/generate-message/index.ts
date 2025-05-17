
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";

interface RequestBody {
  mood: string;
  quizResult: string;
  dayNumber: number;
  messageType: "ritual" | "celia";
  userName?: string;
}

serve(async (req) => {
  // Lidar com requisições OPTIONS para CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY não está configurada");
    }

    // Obter os dados do corpo da requisição
    const body: RequestBody = await req.json();
    const { mood, quizResult, dayNumber, messageType, userName } = body;

    // Validar os parâmetros necessários
    if (!mood || !messageType) {
      return new Response(
        JSON.stringify({ error: "Parâmetros obrigatórios ausentes" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Construir a mensagem para a API da OpenAI com base no tipo de mensagem
    let systemMessage = "";
    let userMessage = "";

    if (messageType === "ritual") {
      systemMessage = `Você é Célia, uma especialista em menopausa que atua como mentora e guia pessoal no aplicativo Florescer. 
      Seu tom de voz é acolhedor, empático e encorajador. Você usa linguagem acessível e calorosa, como se fosse uma amiga sábia.
      Gere mensagens personalizadas para o ritual diário do usuário, adaptadas para o humor atual dela.`;

      userMessage = `Crie uma mensagem emocional personalizada para uma mulher na menopausa que está se sentindo "${mood}".
      ${quizResult ? `Ela está no perfil "${quizResult}" de menopausa.` : ""}
      Esta é para o dia ${dayNumber} de um programa de 21 dias.
      A mensagem deve ser curta (máximo 3 frases), direta, acolhedora e motivadora.
      NÃO inclua cumprimentos como "Olá" ou "Querida".
      NÃO assine a mensagem.`;
    } else if (messageType === "celia") {
      systemMessage = `Você é Célia, uma especialista em menopausa que atua como mentora e guia pessoal no aplicativo Florescer. 
      Seu tom de voz é acolhedor, empático, com um toque de sabedoria espiritual sem ser religiosa.
      Gere frases terapêuticas e inspiradoras sobre autoconhecimento, autoaceitação e bem-estar.`;

      userMessage = `Crie uma frase terapêutica ou inspiradora para uma mulher na menopausa que está se sentindo "${mood}" hoje.
      ${quizResult ? `Ela está no perfil "${quizResult}" de menopausa.` : ""}
      ${userName ? `Seu nome é ${userName}.` : ""}
      Esta deve ser uma frase curta (máximo 2 frases), profunda e significativa, que possa ser facilmente memorizada.
      A frase deve trazer conforto, inspiração ou uma nova perspectiva sobre o momento que ela está vivendo.
      NÃO inclua cumprimentos no início ou assinatura no final.`;
    }

    // Fazer a chamada para a API da OpenAI
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error("Erro na API da OpenAI:", errorData);
      throw new Error(`Erro na API da OpenAI: ${openAIResponse.status}`);
    }

    const data = await openAIResponse.json();
    const generatedMessage = data.choices[0]?.message?.content || "Sua jornada é única e valiosa. Confie no processo de transformação.";

    // Retornar a mensagem gerada
    return new Response(
      JSON.stringify({
        message: generatedMessage.trim(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Em caso de erro, retornar uma mensagem padrão e logar o erro
    console.error("Erro:", error.message);
    
    return new Response(
      JSON.stringify({
        message: "Sua jornada é única e valiosa. Confie no processo de transformação.",
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
