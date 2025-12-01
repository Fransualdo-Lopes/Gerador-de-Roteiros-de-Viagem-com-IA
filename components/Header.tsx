import React from 'react';
import { Plane, LogOut, User as UserIcon, Map, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-blue p-2 rounded-lg text-white group-hover:scale-105 transition-transform">
            <Plane size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-bold font-serif text-brand-blue dark:text-sky-400 tracking-tight transition-colors">
            Viaja<span className="text-brand-coral">IA</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-sky-400 font-medium transition-colors">
                <Map size={18} />
                Meus Roteiros
              </Link>
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Olá, {user?.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-coral hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
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
                 className="text-brand-blue dark:text-sky-400 font-semibold hover:underline hidden sm:block"
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