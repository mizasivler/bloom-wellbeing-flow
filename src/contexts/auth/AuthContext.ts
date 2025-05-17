
import { createContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserData } from '@/types';

export interface AuthContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  session: Session | null;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
