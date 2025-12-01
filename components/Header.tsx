import React from 'react';
import { Plane, LogOut, User as UserIcon, Map } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-blue p-2 rounded-lg text-white group-hover:scale-105 transition-transform">
            <Plane size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-bold font-serif text-brand-blue tracking-tight">
            Viaja<span className="text-brand-coral">IA</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-brand-blue font-medium transition-colors">
                <Map size={18} />
                Meus Roteiros
              </Link>
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  Olá, {user?.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-brand-coral hover:bg-red-50 rounded-full transition-colors"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                 onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                 className="text-brand-blue font-semibold hover:underline hidden sm:block"
              >
                Entrar
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                className="bg-brand-blue hover:bg-[#004a75] text-white px-5 py-2 rounded-full font-medium transition-colors shadow-lg shadow-brand-blue/20 flex items-center gap-2"
              >
                <UserIcon size={16} />
                <span className="hidden sm:inline">Criar Conta</span>
                <span className="sm:hidden">Entrar</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};