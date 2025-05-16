
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MoodType, RitualStatus, ProductType } from '@/types';
import { useAuth } from './AuthContext';

interface AppContextType {
  userMood: MoodType | null;
  setUserMood: (mood: MoodType) => void;
  ritualStatus: RitualStatus;
  completeRitual: () => void;
  savedMessages: string[];
  saveMessage: (message: string) => void;
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

  // Initialize data from user when auth changes
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
      
      // In a real app, we would fetch saved messages from Supabase
      setSavedMessages([
        "Hoje você não precisa ser forte. Só precisa ser real.",
        "Sua vulnerabilidade não é fraqueza, é coragem em sua forma mais pura."
      ]);
    }
  }, [user]);

  const completeRitual = () => {
    setRitualStatus(prev => ({
      ...prev,
      completed: true,
      day: Math.min(prev.day + 1, prev.totalDays)
    }));
    
    // In a real app, we'd update this in Supabase
  };

  const saveMessage = (message: string) => {
    if (!savedMessages.includes(message)) {
      setSavedMessages(prev => [...prev, message]);
      
      // In a real app, we'd save this to Supabase
    }
  };

  const value = {
    userMood,
    setUserMood,
    ritualStatus,
    completeRitual,
    savedMessages,
    saveMessage,
    products
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
