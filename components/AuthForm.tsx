
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTranslation } from '../context/LanguageContext.tsx';
import { ArrowLeft, Loader2, AlertCircle, Mail, Lock, ZapOff, Info, ShieldCheck, User as UserIcon, Sparkles } from 'lucide-react';

const AuthForm: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInDemo, isConfigured, user } = useAuth();
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      window.location.hash = user.role === 'admin' ? '#/admin' : '#/dashboard';
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
        if (isConfigured) {
          setError("Conta criada! Verifique seu e-mail para confirmar.");
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "Erro de autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isConfigured) {
      setError("O Login com Google exige chaves reais da Vercel.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message || "Não foi possível conectar ao Google.");
      setIsLoading(false);
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        {/* Demo Quick Access Section */}
        <div className="mb-10 relative z-10">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-px bg-slate-100 flex-grow"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center">
              <Sparkles className="w-3 h-3 mr-2 text-indigo-500" />
              Acesso Rápido Maestro
            </span>
            <div className="h-px bg-slate-100 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => signInDemo('admin')}
              className="flex flex-col items-center justify-center p-4 bg-slate-900 text-white rounded-3xl hover:bg-indigo-600 transition-all shadow-xl group"
            >
              <ShieldCheck className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Painel Admin</span>
            </button>
            <button 
              onClick={() => signInDemo('client')}
              className="flex flex-col items-center justify-center p-4 bg-white border-2 border-slate-100 text-slate-600 rounded-3xl hover:border-indigo-600 hover:text-indigo-600 transition-all group shadow-sm"
            >
              <UserIcon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Acesso Cliente</span>
            </button>
          </div>
        </div>

        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl font-black text-slate-900 font-serif mb-2 tracking-tight">
            {isLogin ? t('welcome') : t('createAccount')}
          </h2>
          <p className="text-slate-500 font-medium text-xs">
            Acesse com suas credenciais ou utilize os botões demo acima.
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-2xl flex items-start space-x-3 text-xs animate-in fade-in zoom-in duration-300 ${error.includes('confirmar') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="font-bold leading-relaxed">{error}</p>
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`w-full flex items-center justify-center space-x-4 px-6 py-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-indigo-100 transition-all mb-8 font-bold text-slate-700 relative group ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'} ${!isConfigured ? 'grayscale opacity-50 cursor-help' : ''}`}
          title={!isConfigured ? "Requer configuração real" : ""}
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
          <span>{isLoading ? 'Aguarde...' : t('continueGoogle')}</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@maestro.com"
                disabled={isLoading}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-5 bg-slate-900 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center space-x-3 text-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-600 hover:-translate-y-1 active:scale-95'}`}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{isLoading ? 'Autenticando...' : (isLogin ? t('signIn') : t('createAccount'))}</span>
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-medium text-slate-500">
          {isLogin ? "Deseja criar conta?" : "Já possui acesso?"} 
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="ml-2 text-indigo-600 font-black hover:underline underline-offset-4"
          >
            {isLogin ? 'Registrar Agora' : 'Entrar no Hub'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
