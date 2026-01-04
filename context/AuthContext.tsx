
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
    if (p && p[key] && p[key] !== 'undefined' && p[key] !== '') return p[key];
    const cleanKey = key.replace('VITE_', '');
    if (p && p[cleanKey] && p[cleanKey] !== 'undefined' && p[cleanKey] !== '') return p[cleanKey];
  }
  return '';
};

// Configurações do Supabase - Usando as chaves fornecidas como padrão para ativação imediata
const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || 'https://gjizouagaskhelfghhhd.supabase.co';
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_LckgGWV6XsD8T5uahcPdeA_B0xxOdwg';

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

// Verificação de configuração: agora deve retornar true devido aos fallbacks acima
const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.includes('supabase.co'));
let supabase: any = null;

if (isConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  } catch (e) {
    console.error("Erro na inicialização do Supabase:", e);
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
        if (error) console.error("Erro ao recuperar sessão:", error);
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
      throw new Error("Conexão com banco de dados indisponível.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    
    if (error) {
      const msg = error.message === 'Invalid login credentials' 
        ? 'Credenciais incorretas. Verifique se o usuário foi criado no painel do Supabase.' 
        : error.message;
      throw new Error(msg);
    }
    
    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (!factorsError && factors?.totp) {
      const totpFactor = factors.totp.find((f: any) => f.status === 'verified');
      if (totpFactor) {
        return { mfaRequired: true, factorId: totpFactor.id };
      }
    }
    
    handleUserSession(data.user);
    return { mfaRequired: false };
  };

  const verifyMfa = async (code: string, factorId: string) => {
    if (!supabase) throw new Error("Supabase não configurado.");

    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      code,
      factorId: factorId
    });
    
    if (error) throw new Error("Código de autenticação inválido.");
    handleUserSession(data.user);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!supabase) throw new Error("Banco de dados não configurado.");
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: { 
        data: { 
          role: email.includes('admin') ? 'admin' : 'client',
          full_name: email.split('@')[0]
        } 
      }
    });
    if (error) throw error;
  };

  const signInDemo = (role: 'admin' | 'client') => {
    const demoUser: User = {
      id: `demo-${role}`,
      email: `${role}@maestro-demo.local`,
      role: role,
      name: `Demo ${role.toUpperCase()}`
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
