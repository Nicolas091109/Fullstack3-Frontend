import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, Shield, Heart, PlusCircle, Map, List, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const Navbar: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isUserArea = location.pathname.startsWith('/usuario');
  const isAdminArea = location.pathname === '/admin';

  return (
    <header className="sticky top-0 z-50 bg-brand-primary text-white border-b border-brand-primary-hover shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link 
              to={user ? (user.role === 'admin' ? '/admin' : '/usuario/reportes') : '/login'} 
              className="flex items-center space-x-2 text-[#FDFBF7] font-extrabold text-xl tracking-tight"
            >
              <div className="p-2 bg-brand-tertiary rounded-xl text-brand-primary flex items-center justify-center shadow-inner">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <span className="font-serif italic font-bold text-xl lg:text-2xl">
                Sanos y Salvos
              </span>
            </Link>
          </div>

          {/* Navigation Links inside User Area */}
          {user && user.role === 'user' && isUserArea && (
            <nav className="hidden md:flex space-x-1.5 bg-[#3b4b3f]/60 p-1 rounded-xl">
              <Link
                to="/usuario/reportes"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/usuario/reportes'
                    ? 'bg-brand-primary-light text-brand-primary shadow-sm'
                    : 'text-[#E9E1D4] hover:text-[#FDFBF7] hover:bg-white/5'
                }`}
              >
                <List className="h-4 w-4" />
                <span>Galería de Reportes</span>
              </Link>
              <Link
                to="/usuario/crear"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/usuario/crear'
                    ? 'bg-brand-primary-light text-brand-primary shadow-sm'
                    : 'text-[#E9E1D4] hover:text-[#FDFBF7] hover:bg-white/5'
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Crear Reporte</span>
              </Link>
              <Link
                to="/usuario/mapa"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/usuario/mapa'
                    ? 'bg-brand-primary-light text-brand-primary shadow-sm'
                    : 'text-[#E9E1D4] hover:text-[#FDFBF7] hover:bg-white/5'
                }`}
              >
                <Map className="h-4 w-4" />
                <span>Mapa Satelital</span>
              </Link>
              <Link
                to="/usuario/chats"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/usuario/chats'
                    ? 'bg-brand-primary-light text-brand-primary shadow-sm'
                    : 'text-[#E9E1D4] hover:text-[#FDFBF7] hover:bg-white/5'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Mensajes</span>
              </Link>
            </nav>
          )}

          {/* User Profile / Logout Control */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-[#E9E1D4] font-medium opacity-80">Conectado como</p>
                    <p className="text-sm font-semibold text-[#FDFBF7] flex items-center justify-end space-x-1">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-brand-accent/30 text-[#FDFBF7] border border-brand-accent/50">
                          <Shield className="h-3 w-3 mr-1" />
                          {user.name}
                        </span>
                      ) : (
                        <span>{user.name}</span>
                      )}
                    </p>
                  </div>
                  
                  {/* User Avatar */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform hover:scale-105 ${
                    user.role === 'admin' 
                      ? 'bg-brand-accent text-[#FDFBF7]' 
                      : 'bg-[#7C8B7F] border-2 border-brand-tertiary text-[#FDFBF7]'
                  }`}>
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl text-sm font-medium transition-all cursor-pointer border-0 shadow-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </motion.button>
              </>
            ) : (
              <span className="text-sm font-medium text-[#E9E1D4] opacity-95">
                Página de Reporteo de Mascotas
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
