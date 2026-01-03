
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import StartProject from './components/StartProject';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { SERVICES, APP_NAME, PAYMENT_METHODS } from './constants';
import { ShoppingBag, ChevronRight, Music, Check, Star, Loader2, Award, Zap, Shield, ArrowLeft, CreditCard } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { addToCart } = useCart();
  const { t, language } = useTranslation();
  
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
          
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 grayscale contrast-125">
             <div className="flex items-center justify-center font-serif font-bold text-3xl">OXFORD</div>
             <div className="flex items-center justify-center font-serif font-bold text-3xl">B&H</div>
             <div className="flex items-center justify-center font-serif font-bold text-3xl">PETERS</div>
             <div className="flex items-center justify-center font-serif font-bold text-3xl">SCHIRMER</div>
          </div>
        </div>
        
        {/* Subtle Background Elements */}
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
          {SERVICES.map((service) => (
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

      {/* Trust Banner */}
      <section className="bg-slate-900 py-32 rounded-[5rem] mx-4 sm:mx-12 lg:mx-20 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.3),transparent)]"></div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl font-bold text-white font-serif mb-20">{t('trustTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:bg-indigo-600 transition-all duration-500">
                <Zap className="w-10 h-10 text-indigo-400 group-hover:text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">48h Delivery</h4>
              <p className="text-slate-400 text-base leading-relaxed font-light">Swift priority queue for international orchestral standard engraving.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:bg-emerald-600 transition-all duration-500">
                <Shield className="w-10 h-10 text-emerald-400 group-hover:text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Native .mscz</h4>
              <p className="text-slate-400 text-base leading-relaxed font-light">High-fidelity digital masters designed for MuseScore 4.2+ protocols.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-amber-500/20 group-hover:bg-amber-600 transition-all duration-500">
                <Check className="w-10 h-10 text-amber-400 group-hover:text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Maestro Audited</h4>
              <p className="text-slate-400 text-base leading-relaxed font-light">Every measure verified by a conservatory-trained music technical editor.</p>
            </div>
          </div>
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
        <button 
          onClick={() => window.location.hash = '#/'}
          className="px-14 py-6 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all text-lg active:scale-95"
        >
          {t('viewServices')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-12">
        <button 
          onClick={() => window.location.hash = '#/'}
          className="flex items-center space-x-3 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('backHome')}</span>
        </button>
      </div>

      <div className="flex items-center space-x-6 mb-16">
        <h1 className="text-6xl font-black text-slate-900 font-serif">{t('checkout')}</h1>
        <div className="h-0.5 flex-grow bg-slate-100"></div>
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
                    <button 
                      onClick={() => removeFromCart(item.serviceId)}
                      className="text-slate-300 hover:text-red-500 font-black text-xs uppercase tracking-widest transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 ring-1 ring-slate-100">
            <div className="flex items-center space-x-4 mb-8">
              <CreditCard className="w-6 h-6 text-indigo-600" />
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{t('paymentMethod')}</h3>
            </div>
            <p className="text-slate-500 mb-8 font-medium">{t('selectPayment')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${selectedPayment === method.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200'}`}
                >
                  <span className="font-bold text-slate-800">{method.name}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                    {selectedPayment === method.id && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {!user && (
            <div className="bg-slate-900 p-12 rounded-[3rem] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-indigo-500/20 rounded-2xl ring-1 ring-indigo-500/40">
                   <Star className="w-8 h-8 text-indigo-400 fill-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-2xl">Manage your catalog</h4>
                  <p className="text-slate-400 text-base font-light mt-1">Sign in to track live project progress and download assets.</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.hash = '#/login'}
                className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all whitespace-nowrap shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                {t('signIn')}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 sticky top-24 ring-1 ring-slate-100">
            <h3 className="text-3xl font-black mb-10 font-serif">{t('orderSummary')}</h3>
            <div className="space-y-6 mb-12">
              <div className="flex justify-between text-slate-500 font-bold">
                <span className="text-sm uppercase tracking-widest">Subtotal</span>
                <span className="text-slate-900">{currency}{total}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span className="text-sm uppercase tracking-widest">Processing</span>
                <span className="text-emerald-600 font-black text-xs tracking-widest uppercase">Included</span>
              </div>
              <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xl font-bold">{t('total')}</span>
                <span className="text-4xl font-black text-indigo-600">{currency}{total}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] transition-all shadow-2xl flex items-center justify-center space-x-4 text-xl ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-600 hover:-translate-y-2'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  <span className="uppercase tracking-widest">Submitting...</span>
                </>
              ) : (
                <>
                  <span>{t('finalizePayment')}</span>
                  <ChevronRight className="w-6 h-6" />
                </>
              )}
            </button>
            <div className="mt-10 flex items-center justify-center space-x-5 opacity-20">
              <div className="h-7 w-12 bg-slate-900 rounded-lg"></div>
              <div className="h-7 w-12 bg-slate-900 rounded-lg"></div>
              <div className="h-7 w-12 bg-slate-900 rounded-lg"></div>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-[0.3em] font-black">{t('securedBy')}</p>
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
        <CartProvider>
          <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
              {renderContent()}
            </main>
            
            <footer className="bg-slate-900 text-slate-500 py-24">
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-20 border-b border-slate-800 pb-20">
                <div className="space-y-8 col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20">
                      <Music className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold font-serif text-white tracking-tighter">{APP_NAME}</span>
                  </div>
                  <p className="text-lg leading-relaxed max-w-md font-light">
                    The premier technical interface for world-class composers, arrangers, and orchestration houses. 
                    Standardizing the global musical score since 2024.
                  </p>
                </div>
                
                <div>
                  <h5 className="text-white font-black text-sm uppercase tracking-widest mb-10">Protocols</h5>
                  <ul className="space-y-6 text-base font-medium">
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">MuseScore 4.2+ SDK</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">SMuFL Standardization</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">XML Interoperability</a></li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-white font-black text-sm uppercase tracking-widest mb-10">Contact</h5>
                  <ul className="space-y-6 text-base font-medium">
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Global Priority Support</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Enterprise Terms</a></li>
                    <li><a href="mailto:ops@maestroflow.com" className="hover:text-indigo-400 transition-colors font-bold text-indigo-400">ops@maestroflow.com</a></li>
                  </ul>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 pt-12 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                © 2024 MaestroFlow Technical Hub • Built for the Conservatory Elite
              </div>
            </footer>
          </div>
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
