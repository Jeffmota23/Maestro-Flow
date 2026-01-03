
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.ts';
import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  const providers = [
    (import.meta as any).env,
    (window as any).process?.env,
    (window as any).ENV,
    window
  ];
  
  for (const p of providers) {
    if (p && p[key] && p[key] !== 'undefined') return p[key];
    const cleanKey = key.replace('VITE_', '');
    if (p && p[cleanKey] && p[cleanKey] !== 'undefined') return p[cleanKey];
  }
  return '';
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

interface AuthContextType {
  user: User | null;
  signInWithEmail: (email: string, pass: string) => Promise<{ mfaRequired: boolean }>;
  verifyMfa: (code: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInDemo: (role: 'admin' | 'client') => void;
  logout: () => Promise<void>;
  loading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
let supabase: any = null;

if (isConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn("Supabase initialization failed.");
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
    const role = supabaseUser.email?.includes('admin') || supabaseUser.user_metadata?.role === 'admin' ? 'admin' : 'client';
    const newUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: role,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User'
    };
    setUser(newUser);
  };

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }: any) => {
        handleUserSession(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        handleUserSession(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithEmail = async (email: string, pass: string): Promise<{ mfaRequired: boolean }> => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      
      // Check if MFA is required in real Supabase flow
      if (data?.session?.user?.factors) {
        return { mfaRequired: true };
      }
      
      handleUserSession(data.user);
      return { mfaRequired: false };
    } else {
      // Simulation: Ask for Authenticator code for accounts with "admin" in email
      if (email.includes('admin')) {
        return { mfaRequired: true };
      }
      signInDemo('client');
      return { mfaRequired: false };
    }
  };

  const verifyMfa = async (code: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        code,
        factorId: 'totp-factor-id'
      });
      if (error) throw error;
      handleUserSession(data.user);
    } else {
      if (code === '123456') {
        signInDemo('admin');
      } else {
        throw new Error("Código do Google Authenticator inválido.");
      }
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password: pass,
        options: { data: { role: email.includes('admin') ? 'admin' : 'client' } }
      });
      if (error) throw error;
      if (data.user) handleUserSession(data.user);
    } else {
      signInDemo('client');
    }
  };

  const signInDemo = (role: 'admin' | 'client') => {
    const demoUser: User = {
      id: `demo-${role}`,
      email: `${role}@maestroflow.com`,
      role: role,
      name: role === 'admin' ? 'Maestro Admin' : 'John Doe Client'
    };
    setUser(demoUser);
    setLoading(false);
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    window.location.hash = '#/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithEmail, 
      signUpWithEmail, 
      signInDemo,
      verifyMfa,
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
