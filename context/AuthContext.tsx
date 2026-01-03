
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Vercel/Vite environment variables access
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

// Initialize Supabase client
let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for local session first
    const savedUser = localStorage.getItem('maestro_auth');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Set up real auth listener if Supabase is connected
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          handleUserSession(session.user);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          handleUserSession(session.user);
        } else {
          setUser(null);
          localStorage.removeItem('maestro_auth');
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const handleUserSession = (supabaseUser: any) => {
    const role = supabaseUser.email?.includes('admin') ? 'admin' : 'client';
    const newUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: role,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name
    };
    setUser(newUser);
    localStorage.setItem('maestro_auth', JSON.stringify(newUser));
  };

  const login = (email: string, role: 'client' | 'admin') => {
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), email, role };
    setUser(newUser);
    localStorage.setItem('maestro_auth', JSON.stringify(newUser));
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      console.warn("Supabase keys missing. Simulating successful Google login for development.");
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          login('maestro.artist@gmail.com', 'client');
          resolve();
        }, 1000);
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
