import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, DollarSign, Share2, Download, ArrowLeft, Utensils, Camera, Activity as ActivityIcon, Sun } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const ItineraryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { savedItineraries } = useAuth();
  const itinerary = savedItineraries.find(i => i.id === id);

  if (!itinerary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Roteiro não encontrado</h2>
        <Link to="/dashboard" className="text-brand-blue hover:underline">Voltar ao Painel</Link>
      </div>
    );
  }

  // Calculate generic data for chart based on activity types count
  const activityStats = itinerary.days.flatMap(d => d.activities).reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: 'Turismo', value: activityStats['sightseeing'] || 0, color: '#005A8D' },
    { name: 'Gastronomia', value: activityStats['food'] || 0, color: '#FF6B6B' },
    { name: 'Lazer', value: activityStats['activity'] || 0, color: '#FFD166' },
    { name: 'Relax', value: activityStats['relax'] || 0, color: '#4ADE80' },
  ].filter(d => d.value > 0);

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'food': return <Utensils size={16} />;
      case 'sightseeing': return <Camera size={16} />;
      case 'relax': return <Sun size={16} />;
      default: return <ActivityIcon size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch(type) {
      case 'food': return 'bg-orange-100 text-orange-600';
      case 'sightseeing': return 'bg-blue-100 text-blue-600';
      case 'relax': return 'bg-green-100 text-green-600';
      default: return 'bg-purple-100 text-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] bg-gray-900">
        <img 
          src={itinerary.imageUrl} 
          alt={itinerary.destination} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto">
            <Link to="/dashboard" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={20} className="mr-2" /> Voltar ao Painel
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{itinerary.destination}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-brand-coral" />
                <span className="font-medium">{itinerary.days.length} Dias</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-brand-yellow" />
                <span className="font-medium">Orçamento Est.: {itinerary.totalBudgetEstimate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 font-serif">Seu Roteiro Diário</h2>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Compartilhar">
                <Share2 size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Baixar PDF">
                <Download size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {itinerary.days.map((day, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Icon/Dot on Timeline */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-brand-blue shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-white font-bold text-sm">
                  {day.dayNumber}
                </div>
                
                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-coral">Dia {day.dayNumber}</span>
                    <h3 className="text-lg font-bold text-gray-800">{day.theme}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {day.activities.map((activity, actIdx) => (
                      <div key={actIdx} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                         <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getActivityColor(activity.type)}`}>
                           {getActivityIcon(activity.type)}
                         </div>
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-600">{activity.time}</span>
                             <h4 className="font-semibold text-gray-800 text-sm">{activity.title}</h4>
                           </div>
                           <p className="text-sm text-gray-600 mb-2 leading-relaxed">{activity.description}</p>
                           <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><MapPin size={12} /> {activity.location}</span>
                              <span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign size={12} /> {activity.costEstimate}</span>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Map & Stats */}
        <div className="space-y-6 sticky top-24 h-fit">
          {/* Map Placeholder */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-brand-blue" size={20}/>
              Mapa do Roteiro
            </h3>
            <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden group">
               <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png" 
                  alt="Mapa mundi"
                  className="w-full h-full object-cover opacity-50 grayscale group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                 <button className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-transform">
                   Ver Mapa Interativo
                 </button>
               </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Integração com Google Maps em breve.</p>
          </div>

          {/* Budget/Stats Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4">Distribuição de Atividades</h3>
             <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                   <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis hide />
                   <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{fill: 'transparent'}}
                   />
                   <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                     {chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                   <span className="text-gray-600">Transporte (Méd.)</span>
                   <span className="font-medium text-gray-800">R$ 150/dia</span>
                </div>
                <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                   <span className="text-gray-600">Alimentação (Méd.)</span>
                   <span className="font-medium text-gray-800">R$ 200/dia</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};