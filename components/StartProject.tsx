
import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useServices } from '../context/ServiceContext.tsx';
import { useTranslation } from '../context/LanguageContext.tsx';
import { ArrowLeft, ArrowRight, Music, FileText, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

const StartProject: React.FC = () => {
  const { addToCart } = useCart();
  const { services } = useServices();
  const { t, language } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    composer: '',
    duration: '',
    notes: '',
    serviceId: services[0]?.id || ''
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinish = () => {
    const selectedService = services.find(s => s.id === formData.serviceId);
    if (selectedService) {
      addToCart(selectedService);
      window.location.hash = '#/checkout';
    }
  };

  const steps = [
    { title: t('projectDetails'), icon: Music },
    { title: t('musicalScope'), icon: Clock },
    { title: t('selectService'), icon: Sparkles },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="mb-14">
        <button 
          onClick={() => window.location.hash = '#/'}
          className="flex items-center space-x-3 text-slate-400 hover:text-indigo-600 transition-all font-black text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('backHome')}</span>
        </button>
      </div>

      <div className="mb-20">
        <h1 className="text-5xl font-black text-slate-900 font-serif mb-6">{t('startProject')}</h1>
        <p className="text-slate-500 text-lg font-medium">Standardize your production requirements for conservatory-grade output.</p>
        
        <div className="mt-14 flex items-center justify-between relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-700 rounded-full" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step >= idx + 1;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                  {step > idx + 1 ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] mt-5 ${isActive ? 'text-indigo-600' : 'text-slate-300'}`}>{s.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-12 md:p-24 min-h-[550px] flex flex-col ring-1 ring-slate-100">
        {step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-4xl font-bold text-slate-900 font-serif">Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Project Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Symphony in G Major"
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-600/10 focus:bg-white outline-none transition-all font-bold text-slate-700 text-lg shadow-inner"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Composer / Origin</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ludwig van Beethoven"
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-600/10 focus:bg-white outline-none transition-all font-bold text-slate-700 text-lg shadow-inner"
                  value={formData.composer}
                  onChange={e => setFormData({...formData, composer: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
            <h2 className="text-4xl font-bold text-slate-900 font-serif">{t('musicalScope')}</h2>
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Estimated Duration</label>
              <input 
                type="text" 
                placeholder="05:45"
                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-600/10 focus:bg-white outline-none transition-all font-bold text-slate-700 text-lg shadow-inner"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Technical Specifications</label>
              <textarea 
                rows={4}
                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-600/10 focus:bg-white outline-none transition-all resize-none font-bold text-slate-700 shadow-inner"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
            <h2 className="text-4xl font-bold text-slate-900 font-serif">{t('selectService')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => setFormData({...formData, serviceId: s.id})}
                  className={`p-10 text-left rounded-[3rem] border-2 transition-all duration-500 flex flex-col ${formData.serviceId === s.id ? 'border-indigo-600 bg-indigo-50/50 shadow-2xl ring-4 ring-indigo-600/5' : 'border-slate-100 bg-white hover:border-indigo-200'}`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-4 rounded-2xl ${formData.serviceId === s.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                      <Music className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-900">{s.currency[language]}{s.price[language]}</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-lg mb-2 uppercase tracking-tight">{s.name[language]}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.description[language]}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-16 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center space-x-3 font-black text-sm uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'text-slate-300 hover:text-slate-600'}`}
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={step < 3 ? nextStep : handleFinish}
            className={`px-14 py-6 text-white font-black rounded-3xl transition-all flex items-center space-x-4 shadow-2xl active:scale-95 text-lg uppercase tracking-widest ${step < 3 ? 'bg-slate-900 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <span>{step < 3 ? 'Continue' : 'Commit Project'}</span>
            {step < 3 ? <ArrowRight className="w-6 h-6" /> : <CheckCircle2 className="w-7 h-7" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartProject;
