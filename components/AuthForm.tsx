
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { ArrowLeft, Loader2 } from 'lucide-react';

const AuthForm: React.FC = () => {
  const { login, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    
    // Simulate API latency for email login
    setTimeout(() => {
      const role = email.includes('admin') ? 'admin' : 'client';
      login(email, role);
      setIsEmailLoading(false);
      window.location.hash = role === 'admin' ? '#/admin' : '#/dashboard';
    }, 1200);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // If we are using redirect flow, the page will reload
      // If simulated or popup, we handle transition
      if (window.location.hash === '#/login') {
         window.location.hash = '#/dashboard';
      }
    } catch (error) {
      console.error("Authentication Error:", error);
      alert("Falha na autenticação com Google. Verifique as configurações do Supabase.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 bg-white">
      <div className="max-w-md w-full mb-8">
        <button 
          onClick={() => window.location.hash = '#/'}
          className="group flex items-center space-x-3 text-slate-400 hover:text-indigo-600 transition-all font-black text-xs uppercase tracking-[0.2em]"
        >
          <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>{t('backHome')}</span>
        </button>
      </div>

      <div className="max-w-md w-full bg-white p-10 md:p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 ring-1 ring-slate-100 relative overflow-hidden">
        {/* Subtle decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-4xl font-black text-slate-900 font-serif mb-3 tracking-tight">
            {isLogin ? t('welcome') : t('createAccount')}
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            {isLogin ? 'Access your technical musical workspace.' : 'Join the elite circle of professional composers.'}
          </p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isEmailLoading}
          className={`w-full flex items-center justify-center space-x-4 px-6 py-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-indigo-100 transition-all mb-8 font-bold text-slate-700 relative group ${isGoogleLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          ) : (
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
          )}
          <span>{isGoogleLoading ? 'Connecting...' : t('continueGoogle')}</span>
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="px-4 bg-white text-slate-300">Or with workstation credentials</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terminal</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@conservatory.com"
              disabled={isGoogleLoading || isEmailLoading}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isGoogleLoading || isEmailLoading}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-700"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isGoogleLoading || isEmailLoading}
            className={`w-full py-5 bg-slate-900 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center space-x-3 text-lg ${isEmailLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-600 hover:-translate-y-1 active:scale-95'}`}
          >
            {isEmailLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{isEmailLoading ? 'Authenticating...' : (isLogin ? t('signIn') : t('createAccount'))}</span>
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-medium text-slate-500">
          {isLogin ? "New to the hub?" : "Already have access?"} 
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-indigo-600 font-black hover:underline underline-offset-4"
          >
            {isLogin ? 'Register Now' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
