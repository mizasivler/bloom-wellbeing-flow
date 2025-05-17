
import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types';
import { AuthContext } from './AuthContext';
import { 
  fetchUserProfile,
  loginWithEmailAndPassword,
  registerUser,
  updateUserProfile,
  signOut,
  displayAuthToast
} from '@/utils/authUtils';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize and monitor session
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          // Avoid Supabase call inside callback to prevent loop
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id).then(profileData => {
              setUser(profileData);
            });
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id).then(profileData => {
          setUser(profileData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Clean up subscription when unmounting
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await loginWithEmailAndPassword(email, password);

      if (data.user) {
        // Check if first login (determined by quiz result)
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

        displayAuthToast('login', true);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      displayAuthToast('login', false, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register new user
  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await registerUser(email, password, name);
      displayAuthToast('register', true);
    } catch (error: any) {
      console.error('Registration error:', error);
      displayAuthToast('register', false, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
      navigate('/login');
      displayAuthToast('logout', true);
    } catch (error: any) {
      console.error('Logout error:', error);
      displayAuthToast('logout', false, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUserData = async (data: Partial<UserData>) => {
    try {
      setIsLoading(true);
      
      if (user?.id) {
        await updateUserProfile(user.id, data);
        
        // Update local state
        setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
        displayAuthToast('update', true);
      }
    } catch (error: any) {
      console.error('Update data error:', error);
      displayAuthToast('update', false, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
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
