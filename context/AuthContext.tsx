
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
  signInWithEmail: (email: string, pass: string) => Promise<{ mfaRequired: boolean; factorId?: string }>;
  verifyMfa: (code: string, factorId: string) => Promise<void>;
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
    console.error("Supabase initialization failed.");
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
      supabase.auth.getSession().then(({ data: { session }, error }: any) => {
        if (error) console.error("Session fetch error:", error);
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

  const signInWithEmail = async (email: string, pass: string): Promise<{ mfaRequired: boolean; factorId?: string }> => {
    if (!supabase) {
      throw new Error("Sistema em modo demonstração. Utilize os botões 'Fast Access' para testar, pois as chaves do banco (Supabase) não foram detectadas.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    
    if (error) {
      // Aqui o Supabase retorna erro real se o e-mail ou senha estiverem errados
      throw new Error("Credenciais inválidas. Verifique seu e-mail e senha no banco de dados.");
    }
    
    // Verificar se o usuário tem MFA habilitado (TOTP/Google Authenticator)
    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) throw factorsError;

    const totpFactor = factors.totp.find((f: any) => f.status === 'verified');
    
    if (totpFactor) {
      return { mfaRequired: true, factorId: totpFactor.id };
    }
    
    handleUserSession(data.user);
    return { mfaRequired: false };
  };

  const verifyMfa = async (code: string, factorId: string) => {
    if (!supabase) {
      if (code === '123456') {
        signInDemo('admin');
        return;
      }
      throw new Error("Código demo inválido. Use 123456.");
    }

    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      code,
      factorId: factorId
    });
    
    if (error) throw new Error("Código do Authenticator inválido ou expirado.");
    handleUserSession(data.user);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!supabase) throw new Error("Configuração do Supabase necessária para registro real.");
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: { data: { role: email.includes('admin') ? 'admin' : 'client' } }
    });
    if (error) throw error;
  };

  const signInDemo = (role: 'admin' | 'client') => {
    const demoUser: User = {
      id: `demo-${role}`,
      email: `${role}@maestroflow.demo`,
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
