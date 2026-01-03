
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTranslation } from '../context/LanguageContext.tsx';
import { ArrowLeft, Loader2, AlertCircle, Mail, Lock, ShieldCheck, User as UserIcon, Sparkles, KeyRound, Database } from 'lucide-react';

const AuthForm: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, verifyMfa, signInDemo, isConfigured, user } = useAuth();
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
    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const result = await signInWithEmail(email, password);
        if (result.mfaRequired) {
          setCurrentFactorId(result.factorId || 'demo');
          setShowMfa(true);
        }
      } else {
        await signUpWithEmail(email, password);
        setError("Conta criada com sucesso! Verifique seu e-mail para ativar a conta antes de entrar.");
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "Erro de autenticação.");
    } finally {
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
        
        {!showMfa ? (
          <>
            {/* Demo Quick Access - Para desenvolvedores quando o banco não estiver configurado */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Fast Access (Demo)
                </span>
                <div className="h-px bg-slate-50 flex-grow"></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => signInDemo('admin')} className="flex-1 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-indigo-600 transition-all shadow-sm">Admin Demo</button>
                <button onClick={() => signInDemo('client')} className="flex-1 py-2.5 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">Client Demo</button>
              </div>
            </div>

            <div className="text-center mb-10 relative z-10">
              <h2 className="text-4xl font-black text-slate-900 font-serif mb-2 tracking-tight">
                {isLogin ? "Maestro Hub" : "Crie seu Acesso"}
              </h2>
              <p className="text-slate-500 font-medium text-xs">
                {isConfigured 
                  ? "Conectado ao banco de dados oficial." 
                  : "Modo Offline (Chaves Supabase ausentes)."}
              </p>
            </div>

            {error && (
              <div className={`mb-6 p-4 rounded-2xl flex items-start space-x-3 text-xs animate-in fade-in zoom-in duration-300 ${error.includes('sucesso') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="font-bold leading-relaxed">{error}</p>
              </div>
            )}

            {!isConfigured && isLogin && (
              <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center space-x-3">
                <Database className="w-5 h-5 text-amber-500" />
                <p className="text-[10px] font-bold text-amber-700 leading-tight">
                  Atenção: Credenciais de e-mail requerem configuração de API. Use os botões demo acima para testar agora.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="maestro@empresa.com"
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
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-700"
                  />
                </div>
              </div>
              
              <button 
                type="submit" disabled={isLoading}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center space-x-3 text-lg hover:bg-indigo-600 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{isLoading ? 'Autenticando...' : (isLogin ? 'Entrar no Hub' : 'Confirmar Cadastro')}</span>
              </button>
            </form>

            <div className="mt-10 text-center text-sm font-medium text-slate-500">
              {isLogin ? "Não possui conta?" : "Já é cadastrado?"} 
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="ml-2 text-indigo-600 font-black hover:underline underline-offset-4"
              >
                {isLogin ? 'Registrar Agora' : 'Voltar ao Login'}
              </button>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-10 duration-500 relative z-10">
            <div className="text-center mb-10">
              <div className="mx-auto w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-indigo-100">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 font-serif mb-2">Google Authenticator</h2>
              <p className="text-slate-500 font-medium text-xs px-6">Insira o código de 6 dígitos gerado no seu dispositivo.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-start space-x-3 text-xs">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleMfaSubmit} className="space-y-8">
              <div className="space-y-3">
                <div className="relative">
                  <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                  <input 
                    type="text" maxLength={6} required value={mfaCode} onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="000000"
                    autoFocus
                    className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-200 outline-none transition-all font-black text-slate-800 text-3xl tracking-[0.3em] text-center"
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={isLoading || mfaCode.length < 6}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 text-lg hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>Verificar Identidade</span>
              </button>

              <button 
                type="button" onClick={() => setShowMfa(false)}
                className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Cancelar e Voltar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
