
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Inicialização e monitoramento de sessão
  useEffect(() => {
    // Configurar o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          // Não chamar Supabase dentro do callback para evitar loop
          // Usar setTimeout para obter dados do perfil
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Verificar sessão existente ao montar o componente
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    // Limpar inscrição ao desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      if (data) {
        setUser(data as UserData);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login com email e senha
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Verificar se é o primeiro login (determinado pelo resultado do quiz)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('quiz_result')
          .eq('id', data.user.id)
          .single();

        const isFirstLogin = !profileData?.quiz_result;

        if (isFirstLogin) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }

        toast({
          title: "Login bem-sucedido",
          description: "Bem-vinda de volta ao Florescer!",
        });
      }
    } catch (error: any) {
      console.error('Erro de login:', error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Email ou senha incorretos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Registro de novo usuário
  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Registrar o usuário com nome completo nos metadados
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Redirecionar para onboarding
        navigate('/onboarding');
        
        toast({
          title: "Registro bem-sucedido",
          description: "Bem-vinda ao Florescer!",
        });
      }
    } catch (error: any) {
      console.error('Erro de registro:', error);
      toast({
        title: "Erro ao registrar",
        description: error.message || "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      navigate('/login');
      
      toast({
        title: "Logout bem-sucedido",
        description: "Esperamos ver você em breve!",
      });
    } catch (error: any) {
      console.error('Erro de logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro ao tentar sair. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar dados do perfil do usuário
  const updateUserData = async (data: Partial<UserData>) => {
    try {
      setIsLoading(true);
      
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update(data)
          .eq('id', user.id);
        
        if (error) {
          throw error;
        }
        
        // Atualizar o estado local
        setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
        
        toast({
          title: "Dados atualizados",
          description: "Suas informações foram atualizadas com sucesso.",
        });

        // Se o humor foi atualizado, salvar no histórico emocional
        if (data.mood) {
          await supabase.from('emotional_history').insert({
            user_id: user.id,
            mood: data.mood
          });
        }
      }
    } catch (error: any) {
      console.error('Erro ao atualizar dados:', error);
      toast({
        title: "Erro ao atualizar dados",
        description: error.message || "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Valores do contexto
  const value = {
    user,
    isLoggedIn: !!session,
    isLoading,
    login,
    register,
    logout,
    updateUserData,
    session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
