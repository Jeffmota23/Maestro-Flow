
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Note: In production, these should be in process.env/environment variables
// For this environment, we'll use a structure that allows easy replacement
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'client' | 'admin') => void;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize Supabase only if keys are provided
let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('maestro_auth');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Listen to real Supabase auth changes if initialized
    if (supabase) {
      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const newUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.email?.includes('admin') ? 'admin' : 'client',
            name: session.user.user_metadata?.full_name
          };
          setUser(newUser);
          localStorage.setItem('maestro_auth', JSON.stringify(newUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('maestro_auth');
        }
      });
    }
    
    setLoading(false);
  }, []);

  const login = (email: string, role: 'client' | 'admin') => {
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), email, role };
    setUser(newUser);
    localStorage.setItem('maestro_auth', JSON.stringify(newUser));
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      // Fallback for simulation if keys aren't set yet
      console.warn("Supabase keys not found. Simulating Google Login...");
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          login('maestro.artist@gmail.com', 'client');
          resolve();
        }, 1500);
      });
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('maestro_auth');
    window.location.hash = '#/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signInWithGoogle, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
