import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Sparkles, CheckCircle2, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generateTravelItinerary } from '../services/geminiService';
import { TravelPreferences, UserRole } from '../types';

interface HomeProps {
  onOpenAuth: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenAuth }) => {
  const { isAuthenticated, user, saveItinerary } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<'economic' | 'moderate' | 'luxury'>('moderate');
  const [travelers, setTravelers] = useState<'solo' | 'couple' | 'family' | 'friends'>('couple');
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
      destination,
      duration: days,
      budgetLevel: budget,
      travelers,
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
      navigate(`/itinerary/${itinerary.id}`);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao gerar o roteiro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
                Crie roteiros personalizados em segundos. Otimize seu tempo e orçamento com recomendações inteligentes de quem entende de viagem.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <CheckCircle2 size={16} className="text-brand-coral" /> 100% Personalizado
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
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <MapPin size={16} className="text-brand-blue dark:text-sky-400" /> Destino
                    </label>
                    <input 
                      required
                      type="text" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Ex: Rio de Janeiro, Paris, Tóquio"
                      className="w-full p-3 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                    />
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
                    className="w-full bg-brand-coral hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Planejando Roteiro...
                      </>
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