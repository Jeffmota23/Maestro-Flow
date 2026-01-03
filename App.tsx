
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import AuthForm from './components/AuthForm.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import ClientDashboard from './components/ClientDashboard.tsx';
import StartProject from './components/StartProject.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { ServiceProvider, useServices } from './context/ServiceContext.tsx';
import { LanguageProvider, useTranslation } from './context/LanguageContext.tsx';
import { APP_NAME, PAYMENT_METHODS } from './constants.tsx';
import { ShoppingBag, ChevronRight, Music, Check, Star, Loader2, Award, Zap, Shield, ArrowLeft, CreditCard } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { addToCart } = useCart();
  const { t, language } = useTranslation();
  const { services } = useServices();
  
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-indigo-300 font-semibold text-sm mb-8 animate-fade-in backdrop-blur-sm">
            <Award className="w-4 h-4" />
            <span>Premium Conservatory Standard</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-bold font-serif leading-tight">
            {t('heroTitle').split('.')[0]}. <br />
            <span className="text-indigo-500 italic">{t('heroTitle').split('.')[1]}</span>
          </h1>
          <p className="mt-10 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            {t('heroSubtitle')}
          </p>
          <div className="mt-14 flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => window.location.hash = '#/start-project'}
              className="px-12 py-6 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all text-xl"
            >
              {t('startProject')}
            </button>
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-6 bg-slate-800 text-white font-black rounded-2xl shadow-xl hover:bg-slate-700 transition-all text-xl flex items-center justify-center space-x-3"
            >
              <span>{t('viewServices')}</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="text-left">
            <h2 className="text-5xl font-bold text-slate-900 font-serif">{t('servicesTitle')}</h2>
            <p className="text-slate-500 mt-4 text-xl">{t('servicesSubtitle')}</p>
          </div>
          <div className="h-0.5 flex-grow mx-12 bg-slate-200 hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 flex flex-col h-full ring-1 ring-slate-100/50">
              <div className="p-5 bg-slate-50 rounded-3xl w-fit mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <Music className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{service.name[language]}</h3>
              <p className="text-slate-500 text-sm leading-relaxed flex-grow mb-10 font-medium">{service.description[language]}</p>
              <div className="flex items-center justify-between mt-auto pt-10 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900">{service.currency[language]}{service.price[language]}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Flat Rate</span>
                </div>
                <button 
                  onClick={() => {
                    addToCart(service);
                    const toast = document.createElement('div');
                    toast.className = 'fixed bottom-8 right-8 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-right-10 duration-300 font-bold';
                    toast.innerText = `✓ Added ${service.name[language]}`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 2500);
                  }}
                  className="p-5 bg-slate-900 text-white rounded-3xl hover:bg-indigo-600 transition-all shadow-xl active:scale-90"
                >
                  <ShoppingBag className="w-7 h-7" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const methods = PAYMENT_METHODS[language];

  useEffect(() => {
    if (methods.length > 0) {
      setSelectedPayment(methods[0].id);
    }
  }, [language, methods]);

  const handleCheckout = () => {
    if (!user) {
      window.location.hash = '#/login';
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearCart();
      window.location.hash = '#/dashboard';
    }, 2000);
  };

  const currency = items[0]?.currency || '$';

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-40 text-center px-4">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-slate-100 rounded-[3rem] mb-10 shadow-inner">
          <ShoppingBag className="w-16 h-16 text-slate-300" />
        </div>
        <h2 className="text-5xl font-bold text-slate-900 font-serif mb-6">Your Cart is Quiet</h2>
        <p className="text-slate-500 text-xl mb-12 max-w-lg mx-auto leading-relaxed">Select from our specialized services to begin your professional technical production.</p>
        <button onClick={() => window.location.hash = '#/'} className="px-14 py-6 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all text-lg active:scale-95">
          {t('viewServices')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-12">
        <button onClick={() => window.location.hash = '#/'} className="flex items-center space-x-3 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm uppercase tracking-widest">
          <ArrowLeft className="w-5 h-5" />
          <span>{t('backHome')}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden ring-1 ring-slate-100">
            <div className="p-10 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-black text-2xl text-slate-900 uppercase tracking-tight">Your Portfolio Selection</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {items.map((item, idx) => (
                <div key={idx} className="p-10 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                  <div className="flex items-center space-x-8">
                    <div className="p-5 bg-white rounded-3xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm ring-1 ring-slate-100">
                      <Music className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xl">{item.serviceName}</h4>
                      <p className="text-xs text-indigo-500 uppercase font-black tracking-widest mt-1.5">Conservatory Grade</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-12">
                    <span className="font-black text-slate-900 text-2xl">{item.currency}{item.price}</span>
                    <button onClick={() => removeFromCart(item.serviceId)} className="text-slate-300 hover:text-red-500 font-black text-xs uppercase tracking-widest transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 sticky top-24 ring-1 ring-slate-100">
            <h3 className="text-3xl font-black mb-10 font-serif">{t('orderSummary')}</h3>
            <div className="pt-8 border-t border-slate-100 flex justify-between items-center mb-10">
              <span className="text-xl font-bold">{t('total')}</span>
              <span className="text-4xl font-black text-indigo-600">{currency}{total}</span>
            </div>
            <button onClick={handleCheckout} disabled={loading} className={`w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] transition-all shadow-2xl flex items-center justify-center space-x-4 text-xl ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-600 hover:-translate-y-2'}`}>
              {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <span>{t('finalizePayment')}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [hash, setHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    switch (hash) {
      case '#/': return <LandingPage />;
      case '#/login': return <AuthForm />;
      case '#/admin': return <AdminDashboard />;
      case '#/dashboard': return <ClientDashboard />;
      case '#/checkout': return <CheckoutPage />;
      case '#/start-project': return <StartProject />;
      default: return <LandingPage />;
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <ServiceProvider>
          <CartProvider>
            <div className="min-h-screen bg-white flex flex-col font-sans">
              <Navbar />
              <main className="flex-grow">{renderContent()}</main>
              <footer className="bg-slate-900 text-slate-500 py-12 text-center text-[10px] font-black uppercase tracking-[0.4em]">
                © 2024 MaestroFlow Technical Hub
              </footer>
            </div>
          </CartProvider>
        </ServiceProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
