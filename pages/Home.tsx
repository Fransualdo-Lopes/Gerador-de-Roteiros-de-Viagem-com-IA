import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Sparkles, CheckCircle2, Globe, ShieldCheck, Car, Bus, Plane, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generateTravelItinerary } from '../services/geminiService';
import { TravelPreferences, TransportMode } from '../types';
import { useToast } from '../context/ToastContext';

interface HomeProps {
  onOpenAuth: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenAuth }) => {
  const { isAuthenticated, user, saveItinerary } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<'economic' | 'moderate' | 'luxury'>('moderate');
  const [travelers, setTravelers] = useState<'solo' | 'couple' | 'family' | 'friends'>('couple');
  const [transportMode, setTransportMode] = useState<TransportMode>('plane');
  const [interests, setInterests] = useState('');

  // Store pending generation data if user needs to login
  const [pendingGeneration, setPendingGeneration] = useState<TravelPreferences | null>(null);

  // Effect to handle post-login generation
  React.useEffect(() => {
    if (isAuthenticated && pendingGeneration && !loading) {
        handleGenerate(pendingGeneration);
        setPendingGeneration(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefs: TravelPreferences = {
      origin,
      destination,
      duration: days,
      budgetLevel: budget,
      travelers,
      transportMode,
      interests: interests.split(',').map(i => i.trim()).filter(i => i)
    };

    if (!isAuthenticated) {
      setPendingGeneration(prefs);
      onOpenAuth();
    } else {
      handleGenerate(prefs);
    }
  };

  const handleGenerate = async (prefs: TravelPreferences) => {
    if (!user) return;
    setLoading(true);
    try {
      const itinerary = await generateTravelItinerary(prefs, user.id);
      saveItinerary(itinerary);
      addToast('Roteiro criado com sucesso!', 'success');
      navigate(`/itinerary/${itinerary.id}`);
    } catch (error) {
      console.error(error);
      addToast('Erro ao gerar roteiro. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const messages = [
    "Consultando mapas...",
    "Verificando melhores rotas...",
    "Selecionando atrações...",
    "Calculando custos...",
    "Finalizando seu roteiro..."
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setMessageIndex(0);
    }
  }, [loading]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#005A8D] dark:bg-[#004269] py-20 lg:py-32 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-coral rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-brand-yellow font-medium text-sm mb-6 border border-white/10">
                <Sparkles size={16} />
                <span>Powered by Gemini 2.5 Flash</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-serif font-bold leading-tight mb-6">
                Sua viagem dos sonhos, <br/>
                <span className="text-brand-yellow">planejada com IA.</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Crie roteiros personalizados em segundos com cálculo de rotas e estimativas precisas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <CheckCircle2 size={16} className="text-brand-coral" /> Roteiros com Rotas
                </div>
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <CheckCircle2 size={16} className="text-brand-coral" /> Gratuito para começar
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="lg:w-1/2 w-full max-w-lg">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 transform hover:scale-[1.01] transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-serif">Para onde vamos?</h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Origin and Destination */}
                  <div className="space-y-4">
                    <div className="relative">
                       <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Saindo de</label>
                       <div className="flex items-center">
                         <MapPin size={18} className="absolute left-3 text-brand-coral" />
                         <input 
                           required
                           type="text" 
                           value={origin}
                           onChange={(e) => setOrigin(e.target.value)}
                           placeholder="Ex: São Paulo, SP"
                           className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-colors"
                         />
                       </div>
                    </div>

                    <div className="flex justify-center -my-2 relative z-10">
                        <div className="bg-gray-100 dark:bg-slate-600 p-1.5 rounded-full text-gray-400 dark:text-gray-300">
                            <ArrowRight size={16} className="rotate-90" />
                        </div>
                    </div>

                    <div className="relative">
                       <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">Indo para</label>
                       <div className="flex items-center">
                         <MapPin size={18} className="absolute left-3 text-brand-blue dark:text-sky-400" />
                         <input 
                           required
                           type="text" 
                           value={destination}
                           onChange={(e) => setDestination(e.target.value)}
                           placeholder="Ex: Rio de Janeiro, Paris"
                           className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-colors"
                         />
                       </div>
                    </div>
                  </div>

                  {/* Transport Mode */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Como você vai?</label>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setTransportMode('car')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${transportMode === 'car' ? 'bg-blue-50 dark:bg-slate-700 border-brand-blue text-brand-blue dark:text-sky-400' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                        >
                          <Car size={20} className="mb-1" />
                          <span className="text-xs font-medium">Carro</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransportMode('bus')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${transportMode === 'bus' ? 'bg-blue-50 dark:bg-slate-700 border-brand-blue text-brand-blue dark:text-sky-400' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                        >
                          <Bus size={20} className="mb-1" />
                          <span className="text-xs font-medium">Ônibus</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransportMode('plane')}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${transportMode === 'plane' ? 'bg-blue-50 dark:bg-slate-700 border-brand-blue text-brand-blue dark:text-sky-400' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                        >
                          <Plane size={20} className="mb-1" />
                          <span className="text-xs font-medium">Avião</span>
                        </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Calendar size={16} className="text-brand-blue dark:text-sky-400" /> Dias
                      </label>
                      <input 
                        required
                        type="number" 
                        min="1" 
                        max="14"
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        className="w-full p-3 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                       <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Users size={16} className="text-brand-blue dark:text-sky-400" /> Quem vai?
                      </label>
                      <select 
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value as any)}
                        className="w-full p-3 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-colors"
                      >
                        <option value="solo">Solo</option>
                        <option value="couple">Casal</option>
                        <option value="friends">Amigos</option>
                        <option value="family">Família</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <DollarSign size={16} className="text-brand-blue dark:text-sky-400" /> Orçamento
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['economic', 'moderate', 'luxury'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setBudget(lvl as any)}
                          className={`py-2 px-1 text-sm rounded-lg border transition-colors capitalize ${
                            budget === lvl 
                            ? 'bg-blue-50 dark:bg-slate-700 border-brand-blue text-brand-blue dark:text-sky-400 font-semibold' 
                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {lvl === 'economic' ? 'Econômico' : lvl === 'moderate' ? 'Moderado' : 'Luxo'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Interesses (opcional)</label>
                     <input 
                        type="text" 
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        placeholder="Ex: museus, praias, comida de rua..."
                        className="w-full p-3 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                      />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-coral hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
                  >
                    {loading ? (
                       <div className="flex flex-col items-center">
                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mb-1"></div>
                         <span className="text-xs font-normal animate-pulse">{messages[messageIndex]}</span>
                       </div>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Gerar Roteiro Personalizado
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-white mb-4">Por que usar o ViajaIA?</h2>
            <p className="text-gray-600 dark:text-gray-400">Esqueça horas de pesquisa. Nossa inteligência artificial cria o plano perfeito baseado exatamente no que você gosta.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-brand-blue dark:text-blue-400 mb-4">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Roteiros Globais</h3>
              <p className="text-gray-600 dark:text-gray-400">De mochilão na Tailândia a luxo em Paris, cobrimos qualquer destino com dicas locais.</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Controle de Gastos</h3>
              <p className="text-gray-600 dark:text-gray-400">Estimativas reais de custos diários para você viajar sem surpresas no cartão.</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Segurança de Dados</h3>
              <p className="text-gray-600 dark:text-gray-400">Seus planos e preferências salvos com segurança. Em conformidade com a LGPD.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};