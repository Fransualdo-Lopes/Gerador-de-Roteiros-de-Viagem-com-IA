import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark dark:bg-slate-950 text-gray-400 py-8 border-t border-gray-800 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            © {new Date().getFullYear()} ViajaIA. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-2 text-sm">
            Feito com <Heart size={14} className="text-brand-coral fill-brand-coral" /> para viajantes brasileiros.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
};