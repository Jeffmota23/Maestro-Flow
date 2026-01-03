
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.ts';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let supabase: SupabaseClient | null = null;
const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (isConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error("Supabase init error:", e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleUserSession = (supabaseUser: any) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }
    // Determinação de papel baseada no e-mail ou metadados
    const role = supabaseUser.email?.includes('admin') ? 'admin' : 'client';
    const newUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: role,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name
    };
    setUser(newUser);
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Buscar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças no estado de auth (Login/Logout/OAuth Redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error("Supabase não configurado.");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!supabase) throw new Error("Supabase não configurado.");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!supabase) throw new Error("Supabase não configurado.");
    const { error } = await supabase.auth.signUp({ email, password: pass });
    if (error) throw error;
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    window.location.hash = '#/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithGoogle, 
      signInWithEmail, 
      signUpWithEmail, 
      logout, 
      loading, 
      isConfigured 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
