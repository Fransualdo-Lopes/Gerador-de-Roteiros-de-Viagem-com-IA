import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Trash2, ArrowRight, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { savedItineraries, deleteItinerary, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300">
      {/* Dashboard Header */}
      <div className="bg-brand-blue dark:bg-[#004269] text-white py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold mb-2">Painel do Viajante</h1>
          <p className="text-blue-100">Gerencie suas próximas aventuras, {user?.name}.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {savedItineraries.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin size={32} className="text-brand-blue dark:text-sky-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Nenhum roteiro salvo ainda</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Que tal planejar sua próxima viagem agora? Nossa IA cria um roteiro personalizado em segundos.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 bg-brand-coral hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-brand-coral/20"
            >
              <Plus size={20} />
              Criar Novo Roteiro
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <Link 
              to="/"
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-dashed border-gray-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:border-brand-blue hover:text-brand-blue dark:hover:border-sky-400 dark:hover:text-sky-400 hover:shadow-md transition-all group min-h-[320px]"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-slate-600 flex items-center justify-center mb-4 transition-colors">
                <Plus size={32} />
              </div>
              <span className="font-medium text-lg">Criar Novo Roteiro</span>
            </Link>

            {/* Itinerary Cards */}
            {savedItineraries.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow flex flex-col">
                <div className="h-40 bg-gray-200 relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.destination} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-blue text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {item.days.length} DIAS
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1" title={item.destination}>
                      {item.destination}
                    </h3>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Criado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if(window.confirm('Tem certeza que deseja excluir este roteiro?')) {
                            deleteItinerary(item.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 -ml-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <button
                      onClick={() => navigate(`/itinerary/${item.id}`)}
                      className="flex items-center gap-2 text-brand-blue dark:text-sky-400 font-semibold hover:text-brand-coral dark:hover:text-orange-400 transition-colors"
                    >
                      Ver Detalhes
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};