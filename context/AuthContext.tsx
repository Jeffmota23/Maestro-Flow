
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.ts';
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
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let supabase: SupabaseClient | null = null;
const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (isConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error("Supabase initialization failed:", e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check local storage for legacy session
    const savedUser = localStorage.getItem('maestro_auth');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 2. Set up real Supabase auth listener
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
    // Logic to determine role (can be expanded with Supabase Profiles table)
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
    // Manual login (Email/Pass) - still useful for the admin demo bypass if needed
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), email, role };
    setUser(newUser);
    localStorage.setItem('maestro_auth', JSON.stringify(newUser));
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel environment variables.");
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Use the actual origin to ensure redirects work on Vercel preview URLs
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
    <AuthContext.Provider value={{ user, login, logout, signInWithGoogle, loading, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
