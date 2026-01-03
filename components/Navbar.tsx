
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useTranslation } from '../context/LanguageContext.tsx';
import { Music, ShoppingCart, User, LogOut, ShieldCheck, Globe, ChevronDown } from 'lucide-react';
import { Language } from '../types.ts';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { language, setLanguage, t } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷' },
    { code: 'pt-PT', label: 'Português (PT)', flag: '🇵🇹' },
    { code: 'es-ES', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.hash = '#/'}>
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-serif">MaestroFlow</span>
          </div>

          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-800 transition-all text-sm font-medium border border-slate-700"
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>{languages.find(l => l.code === language)?.flag}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-[100]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${language === lang.code ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => window.location.hash = '#/checkout'} className="relative p-2.5 text-slate-300 hover:text-indigo-400 transition-colors bg-slate-800 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white shadow-lg">{items.length}</span>}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <button onClick={() => window.location.hash = user.role === 'admin' ? '#/admin' : '#/dashboard'} className="flex items-center space-x-2 text-sm font-bold text-slate-200 hover:text-indigo-400 bg-slate-800 px-4 py-2 rounded-xl transition-all">
                  {user.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  <span className="hidden lg:inline">{user.email.split('@')[0]}</span>
                </button>
                <button onClick={logout} className="p-2.5 text-slate-500 hover:text-red-400 rounded-xl transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={() => window.location.hash = '#/login'} className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                {t('signIn')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
