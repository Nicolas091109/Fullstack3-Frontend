import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CreateReportView } from '../components/user-views/CreateReportView';
import { ViewReportsView } from '../components/user-views/ViewReportsView';
import { SatelliteMapView } from '../components/user-views/SatelliteMapView';
import { List, PlusCircle, Map, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const UserDashboard: React.FC = () => {
  const { reports, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  // Active sub-view selection based on path URL
  const renderActiveView = () => {
    if (currentPath === '/usuario/crear') {
      return <CreateReportView />;
    }
    if (currentPath === '/usuario/mapa') {
      return <SatelliteMapView />;
    }
    // Default fallback to ViewReports
    return <ViewReportsView />;
  };

  const tabs = [
    {
      id: 'reportes',
      label: 'Galería de Reportes',
      path: '/usuario/reportes',
      icon: List,
      badge: reports.length
    },
    {
      id: 'crear',
      label: 'Crear Reporte',
      path: '/usuario/crear',
      icon: PlusCircle,
      badge: null
    },
    {
      id: 'mapa',
      label: 'Mapa Satelital Chile',
      path: '/usuario/mapa',
      icon: Map,
      badge: reports.length > 0 ? `${reports.length} Pines` : null
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Simple Welcome Banner */}
        <div className="bg-brand-primary p-8 rounded-[24px] text-[#FDFBF7] shadow-sm relative overflow-hidden border border-brand-primary-hover">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#7C8B7F]/10 rounded-full blur-3xl" />
          
          <div className="z-10 relative space-y-2">
            <div className="flex items-center space-x-2 text-brand-tertiary">
              <Heart className="h-4.5 w-4.5 fill-current" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9C5B2] tracking-wider">Plataforma de Búsqueda</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif italic text-[#FDFBF7] tracking-tight">
              Hola, {user ? user.name : 'Miembro de la Comunidad'}
            </h1>
            <p className="text-sm text-[#E9E1D4] max-w-xl leading-relaxed">
              Trabajamos todos los días para que ninguna mascota se quede desprotegida. Revisa los reportes o crea uno nuevo para activar las brigadas de búsqueda locales.
            </p>
          </div>
        </div>

        {/* Dynamic Secondary Horizontal Navigation Tabs (Mobile optimized) */}
        <div className="flex bg-white rounded-[24px] border border-[#E9E1D4] p-1.5 shadow-sm space-x-1.5 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = currentPath === tab.path || (tab.id === 'reportes' && currentPath === '/usuario');
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary text-[#FDFBF7] shadow-sm'
                    : 'text-brand-secondary hover:text-brand-primary hover:bg-[#F5F2ED]'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{tab.label}</span>
                
                {/* Optional Badge indicator count */}
                {tab.badge !== null && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-[#FDFBF7]'
                      : 'bg-brand-primary-light border border-[#E9E1D4] text-brand-secondary'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Render Area containing active subview component */}
        <motion.div
          key={currentPath}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {renderActiveView()}
        </motion.div>

      </div>
    </div>
  );
};
