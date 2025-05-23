import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MoodType, RitualStatus, ProductType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AppContextType {
  userMood: MoodType | null;
  setUserMood: (mood: MoodType) => void;
  ritualStatus: RitualStatus;
  completeRitual: () => Promise<void>;
  savedMessages: string[];
  saveMessage: (message: string) => Promise<void>;
  products: ProductType[];
}

const defaultRitualStatus: RitualStatus = {
  completed: false,
  day: 1,
  totalDays: 21,
};

const defaultProducts: ProductType[] = [
  {
    id: 'kit-sos',
    name: 'Kit SOS',
    description: 'Materiais exclusivos para momentos desafiadores durante a menopausa.',
    price: 27,
    priceFormatted: 'R$ 27',
    isSubscription: false,
    features: [
      'Guia digital de primeiros socorros emocionais',
      'Áudios de emergência para ansiedade',
      'Lista de verificação para momentos difíceis',
      'Mini-planner imprimível de 7 dias'
    ],
    icon: '🎁',
  },
  {
    id: 'florescer-21',
    name: 'Florescer 21',
    description: 'Programa completo de 21 dias para transformar sua experiência na menopausa.',
    price: 197,
    priceFormatted: 'R$ 197',
    isSubscription: false,
    features: [
      'Programa completo de 21 dias',
      'PDF do planner exclusivo',
      'Meditações guiadas extras',
      'Videoaulas com a Célia',
      'Acesso a comunidade privada'
    ],
    icon: '🌿',
  },
  {
    id: 'premium',
    name: 'Assinatura Premium',
    description: 'Acesso ilimitado a todo o conteúdo exclusivo do Florescer.',
    price: 29,
    priceFormatted: 'R$ 29/mês',
    isSubscription: true,
    features: [
      'Todos os recursos gratuitos',
      'Novas meditações mensais',
      'Acesso ao Diário da Emoção Premium',
      'Consultas mensais com especialistas',
      'Conteúdo exclusivo atualizado semanalmente',
      'Suporte prioritário'
    ],
    icon: '💎',
  }
];

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [userMood, setUserMood] = useState<MoodType | null>(null);
  const [ritualStatus, setRitualStatus] = useState<RitualStatus>(defaultRitualStatus);
  const [savedMessages, setSavedMessages] = useState<string[]>([]);
  const [products] = useState<ProductType[]>(defaultProducts);

  // Inicializar dados do usuário quando auth muda
  useEffect(() => {
    if (user) {
      if (user.mood) {
        setUserMood(user.mood as MoodType);
      }
      
      if (user.completed_rituals) {
        setRitualStatus({
          ...ritualStatus,
          day: user.completed_rituals + 1,
          completed: false,
        });
      }
      
      // Buscar mensagens salvas do Supabase
      fetchSavedMessages();
    }
  }, [user]);

  // Função para buscar mensagens salvas
  const fetchSavedMessages = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('saved_messages')
        .select('message')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Erro ao buscar mensagens salvas:", error);
        return;
      }
      
      if (data && data.length > 0) {
        const messages = data.map(item => item.message);
        setSavedMessages(messages);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens salvas:", error);
    }
  };

  // Atualizar o humor do usuário e salvar no Supabase
  const handleMoodChange = async (mood: MoodType) => {
    setUserMood(mood);
    
    if (user) {
      try {
        // Atualizar o mood no perfil do usuário
        await supabase
          .from('profiles')
          .update({ mood })
          .eq('id', user.id);
        
        // Adicionar ao histórico emocional
        await supabase
          .from('emotional_history')
          .insert({
            user_id: user.id,
            mood
          });
      } catch (error) {
        console.error("Erro ao atualizar humor:", error);
      }
    }
  };

  // Completar ritual e atualizar no Supabase
  const completeRitual = async () => {
    if (!user) return;
    
    try {
      const newDay = Math.min(ritualStatus.day + 1, ritualStatus.totalDays);
      
      // Atualizar o estado local
      setRitualStatus(prev => ({
        ...prev,
        completed: true,
        day: newDay
      }));
      
      // Atualizar no banco de dados
      const { error } = await supabase
        .from('profiles')
        .update({ 
          completed_rituals: newDay - 1 
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Erro ao completar ritual:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar seu progresso. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  // Salvar mensagem no Supabase
  const saveMessage = async (message: string) => {
    if (!user) return;
    
    if (!savedMessages.includes(message)) {
      try {
        // Adicionar à lista local
        setSavedMessages(prev => [...prev, message]);
        
        // Salvar no Supabase
        const { error } = await supabase
          .from('saved_messages')
          .insert({
            user_id: user.id,
            message
          });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Mensagem salva",
          description: "A mensagem foi adicionada às suas favoritas.",
        });
      } catch (error) {
        console.error("Erro ao salvar mensagem:", error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar a mensagem. Tente novamente.",
          variant: "destructive"
        });
        
        // Remover da lista local se falhou no servidor
        setSavedMessages(prev => prev.filter(m => m !== message));
      }
    }
  };

  const value = {
    userMood,
    setUserMood: handleMoodChange,
    ritualStatus,
    completeRitual,
    savedMessages,
    saveMessage,
    products
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
