
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTranslation } from '../context/LanguageContext.tsx';
import { ArrowLeft, Loader2, AlertCircle, Mail, Lock, ShieldCheck, KeyRound, Database, ShieldAlert, Sparkles } from 'lucide-react';

const AuthForm: React.FC = () => {
  const { signInWithEmail, signInWithGoogle, signUpWithEmail, verifyMfa, signInDemo, isConfigured, user } = useAuth();
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showMfa, setShowMfa] = useState(false);
  const [currentFactorId, setCurrentFactorId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      window.location.hash = user.role === 'admin' ? '#/admin' : '#/dashboard';
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError("Conexão Pendente: O banco de dados ainda não foi configurado no painel da Vercel.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const result = await signInWithEmail(email, password);
        if (result.mfaRequired) {
          setCurrentFactorId(result.factorId || null);
          setShowMfa(true);
        }
      } else {
        await signUpWithEmail(email, password);
        setError("Sucesso! Verifique seu e-mail para ativar sua conta antes de tentar o login.");
      }
    } catch (err: any) {
      setError(err.message || "Falha na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o Google.");
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await verifyMfa(mfaCode, currentFactorId || '');
    } catch (err: any) {
      setError(err.message || "Código inválido.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 bg-white">
      <div className="max-w-md w-full mb-8 flex justify-between items-center">
        <button 
          onClick={() => window.location.hash = '#/'}
          className="group flex items-center space-x-3 text-slate-400 hover:text-indigo-600 transition-all font-black text-xs uppercase tracking-[0.2em]"
        >
          <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>{t('backHome')}</span>
        </button>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${isConfigured ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
          <Database className="w-3 h-3" />
          <span>{isConfigured ? 'Banco Online' : 'Modo Demo'}</span>
        </div>
      </div>

      <div className="max-w-md w-full bg-white p-10 md:p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 ring-1 ring-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        {!showMfa ? (
          <>
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-4xl font-black text-slate-900 font-serif mb-2 tracking-tight">
                {isLogin ? "Entrar no Hub" : "Criar Acesso"}
              </h2>
              <p className="text-slate-500 font-medium text-xs">
                {isConfigured ? "Sua conexão está protegida e criptografada." : "Configure o Supabase para ativar o login real."}
              </p>
            </div>

            {/* Google Login Button */}
            <div className="mb-8 relative z-10">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading || !isConfigured}
                className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center space-x-3 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] disabled:opacity-50"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span>{t('continueGoogle')}</span>
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="px-4 bg-white text-slate-300">ou use seu e-mail</span>
                </div>
              </div>
            </div>

            {error && (
              <div className={`mb-6 p-4 rounded-2xl flex items-start space-x-3 text-xs animate-in fade-in zoom-in duration-300 ${error.includes('Sucesso') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="font-bold leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@maestroflow.com"
                    disabled={isLoading || !isConfigured}
                    className={`w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-700 ${!isConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading || !isConfigured}
                    className={`w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-700 ${!isConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading || !isConfigured}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center space-x-3 text-lg hover:bg-indigo-600 hover:-translate-y-1 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                <span>{isLoading ? 'Autenticando...' : (isLogin ? 'Entrar Agora' : 'Registrar')}</span>
              </button>
            </form>

            <div className="mt-10 text-center text-sm font-medium text-slate-400">
              {isLogin ? "Primeira vez?" : "Já tem conta?"} 
              <button 
                onClick={() => setIsLogin(!isLogin)}
                disabled={!isConfigured}
                className="ml-2 text-indigo-600 font-black hover:underline underline-offset-4 disabled:opacity-30"
              >
                {isLogin ? 'Crie seu Perfil' : 'Faça o Login'}
              </button>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-10 duration-500 relative z-10">
            <div className="text-center mb-10">
              <div className="mx-auto w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-indigo-100">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 font-serif mb-2 tracking-tight">Dupla Verificação</h2>
              <p className="text-slate-500 font-medium text-xs px-6">Insira o código gerado no seu aplicativo Google Authenticator.</p>
            </div>

            <form onSubmit={handleMfaSubmit} className="space-y-8">
              <div className="relative">
                <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                <input 
                  type="text" maxLength={6} required value={mfaCode} onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="000 000"
                  autoFocus
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-200 outline-none transition-all font-black text-slate-800 text-3xl tracking-[0.3em] text-center"
                />
              </div>

              <button 
                type="submit" disabled={isLoading || mfaCode.length < 6}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 text-lg hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>Validar Código</span>
              </button>

              <button 
                type="button" onClick={() => setShowMfa(false)}
                className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Voltar e Cancelar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
