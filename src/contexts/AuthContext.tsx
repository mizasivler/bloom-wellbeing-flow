
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '@/types';
import { toast } from '@/components/ui/use-toast';

// This is a placeholder for Supabase connection
// You will need to connect to Supabase integration first
const mockUser: UserData = {
  id: '1',
  email: 'usuario@exemplo.com',
  full_name: 'Maria Silva',
  mood: 'esperançosa',
  quiz_result: 'B',
  completed_rituals: 5,
  created_at: new Date().toISOString(),
};

interface AuthContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    // This would be replaced with actual Supabase auth check
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // For now, we'll mock this behavior
        const hasSession = localStorage.getItem('florescer_session');
        
        if (hasSession) {
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // This would be replaced with actual Supabase auth login
      
      // Mock successful login for demo
      localStorage.setItem('florescer_session', 'true');
      setUser(mockUser);
      
      // Check if it's the first login (would be determined by Supabase data)
      const isFirstLogin = !mockUser.quiz_result;
      
      if (isFirstLogin) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vinda de volta ao Florescer!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // This would be replaced with actual Supabase auth registration
      
      // Mock successful registration for demo
      const newUser = {
        ...mockUser,
        email,
        full_name: name,
        created_at: new Date().toISOString(),
      };
      
      localStorage.setItem('florescer_session', 'true');
      setUser(newUser);
      
      navigate('/onboarding');
      
      toast({
        title: "Registro bem-sucedido",
        description: "Bem-vinda ao Florescer!",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erro ao registrar",
        description: "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // This would be replaced with actual Supabase auth logout
      
      // Mock logout
      localStorage.removeItem('florescer_session');
      setUser(null);
      
      navigate('/login');
      
      toast({
        title: "Logout bem-sucedido",
        description: "Esperamos ver você em breve!",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar sair. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = async (data: Partial<UserData>) => {
    try {
      setIsLoading(true);
      // This would be replaced with actual Supabase user data update
      
      // Mock update
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        
        toast({
          title: "Dados atualizados",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      }
    } catch (error) {
      console.error('Update user data error:', error);
      toast({
        title: "Erro ao atualizar dados",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
