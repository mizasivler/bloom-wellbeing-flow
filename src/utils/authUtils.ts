
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Fetch user profile data from Supabase
export const fetchUserProfile = async (userId: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (data) {
      // Get the email from auth user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // Return combined profile data with email
      return {
        ...data,
        email: authUser?.email || '',
      } as UserData;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Login with email and password using Supabase Auth
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    console.log("Calling Supabase auth.signInWithPassword");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase login error:", error);
      
      // Translate common errors to Portuguese
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Credenciais inválidas. Verifique seu email e senha.");
      } else if (error.message.includes("Email not confirmed")) {
        throw new Error("Email não confirmado. Por favor verifique sua caixa de entrada.");
      }
      
      throw error;
    }
    
    console.log("Login successful, data:", data);
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Register new user with email and password
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    console.log("Calling Supabase auth.signUp");
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
      console.error("Supabase registration error:", error);
      
      // Translate common errors to Portuguese
      if (error.message.includes("User already registered")) {
        throw new Error("Este email já está registrado.");
      } else if (error.message.includes("Password should be at least")) {
        throw new Error("A senha deve ter pelo menos 6 caracteres.");
      }
      
      throw error;
    }

    console.log("Registration successful, data:", data);
    return data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

// Update user profile data
export const updateUserProfile = async (userId: string, data: Partial<UserData>) => {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);
  
  if (error) {
    throw error;
  }

  // If mood was updated, save to emotional history
  if (data.mood && userId) {
    await supabase.from('emotional_history').insert({
      user_id: userId,
      mood: data.mood
    });
  }
};

// Sign out the current user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

// Display toast messages for auth operations
export const displayAuthToast = (
  operation: 'login' | 'register' | 'logout' | 'update', 
  success: boolean, 
  error?: any
) => {
  const messages = {
    login: {
      success: {
        title: "Login bem-sucedido",
        description: "Bem-vinda de volta ao Florescer!",
      },
      error: {
        title: "Erro ao fazer login",
        description: error?.message || "Email ou senha incorretos.",
      }
    },
    register: {
      success: {
        title: "Registro bem-sucedido",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      },
      error: {
        title: "Erro ao registrar",
        description: error?.message || "Não foi possível criar sua conta. Tente novamente.",
      }
    },
    logout: {
      success: {
        title: "Logout bem-sucedido",
        description: "Esperamos ver você em breve!",
      },
      error: {
        title: "Erro ao fazer logout",
        description: error?.message || "Ocorreu um erro ao tentar sair. Tente novamente.",
      }
    },
    update: {
      success: {
        title: "Dados atualizados",
        description: "Suas informações foram atualizadas com sucesso.",
      },
      error: {
        title: "Erro ao atualizar dados",
        description: error?.message || "Não foi possível atualizar suas informações.",
      }
    }
  };

  const message = messages[operation][success ? 'success' : 'error'];
  
  toast({
    title: message.title,
    description: message.description,
    variant: success ? "default" : "destructive",
  });
};
