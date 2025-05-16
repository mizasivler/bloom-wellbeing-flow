
export type UserData = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  mood?: string;
  quiz_result?: string;
  completed_rituals?: number;
  created_at?: string;
};

export type MoodType = 'cansada' | 'aflita' | 'sensível' | 'irritada' | 'esperançosa';

export type QuizResult = 'A' | 'B' | 'C' | 'D';

export type RitualStatus = {
  completed: boolean;
  day: number;
  totalDays: number;
};

export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  priceFormatted: string;
  isSubscription: boolean;
  features: string[];
  icon: string;
};
