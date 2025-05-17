
import { supabase } from '@/integrations/supabase/client';
import { MoodType, QuizResult } from '@/types';

interface GenerateMessageParams {
  mood: MoodType;
  quizResult?: QuizResult;
  dayNumber: number;
  userName?: string;
}

/**
 * Gera uma mensagem emocional para o ritual do dia
 */
export const generateRitualMessage = async (params: GenerateMessageParams): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-message', {
      body: {
        mood: params.mood,
        quizResult: params.quizResult,
        dayNumber: params.dayNumber,
        messageType: 'ritual',
        userName: params.userName
      }
    });
    
    if (error) {
      console.error('Erro ao gerar mensagem de ritual:', error);
      return getFallbackRitualMessage(params.mood);
    }
    
    return data.message;
  } catch (error) {
    console.error('Erro ao gerar mensagem de ritual:', error);
    return getFallbackRitualMessage(params.mood);
  }
};

/**
 * Gera uma mensagem inspiradora da Célia
 */
export const generateCeliaMessage = async (params: GenerateMessageParams): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-message', {
      body: {
        mood: params.mood,
        quizResult: params.quizResult,
        dayNumber: params.dayNumber,
        messageType: 'celia',
        userName: params.userName
      }
    });
    
    if (error) {
      console.error('Erro ao gerar mensagem da Célia:', error);
      return getFallbackCeliaMessage(params.mood);
    }
    
    return data.message;
  } catch (error) {
    console.error('Erro ao gerar mensagem da Célia:', error);
    return getFallbackCeliaMessage(params.mood);
  }
};

// Mensagens de fallback para o ritual do dia
const getFallbackRitualMessage = (mood: MoodType): string => {
  const fallbackMessages = {
    cansada: "Hoje, permita-se descansar sem culpa. Seu corpo está pedindo uma pausa.",
    aflita: "Respire fundo. A ansiedade é como uma onda - ela vem, mas também vai embora.",
    sensível: "Hoje, permita-se acolher suas emoções com gentileza.",
    irritada: "Sua irritação tem algo a ensinar. Observe-a com curiosidade, não julgamento.",
    esperançosa: "Esse brilho em você ilumina seu caminho. Celebre a esperança."
  };
  
  return fallbackMessages[mood] || "A cada dia, uma nova oportunidade de se reconectar consigo mesma.";
};

// Mensagens de fallback da Célia
const getFallbackCeliaMessage = (mood: MoodType): string => {
  const fallbackMessages = {
    cansada: "O descanso não é preguiça, é parte essencial da sua força.",
    aflita: "Cada respiração profunda é um lembrete: você está segura neste momento.",
    sensível: "Sua sensibilidade é um dom que permite que você sinta o mundo de formas que outros não conseguem.",
    irritada: "A irritação pede para ser ouvida, não para controlar suas escolhas.",
    esperançosa: "Esperança é plantar sementes mesmo quando não se vê flores."
  };
  
  return fallbackMessages[mood] || "Você é mais forte do que pensa, mais sábia do que acredita, e mais amada do que imagina.";
};
