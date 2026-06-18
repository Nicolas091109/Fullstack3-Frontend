import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Report } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, MapPin, Calendar, Compass, 
  Info, Eye, X, BookOpen, AlertCircle, Sparkles, Smile, MessageSquare, PhoneCall
} from 'lucide-react';

export const ViewReportsView: React.FC = () => {
  const { reports } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Filter actions
  const filteredReports = reports.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'perdido' && r.status === 'Perdido') ||
      (filterType === 'encontrado' && r.status === 'Encontrado') ||
      (filterType === 'perro' && r.type === 'Perro') ||
      (filterType === 'gato' && r.type === 'Gato');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* Intro Header + Search controls block */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 bg-white p-6 sm:p-8 rounded-[24px] border border-[#E9E1D4] shadow-sm">
        
        <div className="space-y-1">
          <h2 className="text-xl font-serif text-brand-primary italic">Galería Comunitaria de Reportes</h2>
          <p className="text-xs text-brand-secondary leading-relaxed font-semibold">
            Consulta o ayuda a identificar las mascotas reportadas recientemente por vecinos en tu delegación o vecindario.
          </p>
        </div>

        {/* Dynamic Controls search bar and action filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
              <Search className="h-4 w-4" />
            </div>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, detalles o zona de Chile..."
              className="w-full pl-10 pr-4 h-11 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-medium text-[#2D2D2D]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-3 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl text-brand-secondary flex items-center justify-center">
              <Filter className="h-4 w-4" />
            </div>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl h-11 px-3 pr-8 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-bold text-brand-secondary"
            >
              <option value="all">Filtrar: Todos</option>
              <option value="perdido">Solo Perdidos</option>
              <option value="encontrado">Solo Encontrados</option>
              <option value="perro">Solo Perros</option>
              <option value="gato">Solo Gatos</option>
            </select>
          </div>

        </div>

      </div>

      {/* Grid of Cards */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {filteredReports.map((report) => (
            <motion.div 
              key={report.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] border border-[#E9E1D4] shadow-sm overflow-hidden flex flex-col justify-between group h-full cursor-pointer hover:shadow-md"
              onClick={() => setSelectedReport(report)}
            >
              
              {/* Pet image section with overlay state badge */}
              <div className="aspect-[4/3] w-full relative bg-[#FDFBF7] overflow-hidden">
                <img 
                  src={report.photo} 
                  alt={report.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* State Overlay badge (Perdido / Encontrado) */}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm border ${
                    report.status === 'Perdido' 
                      ? 'bg-brand-accent text-white border-brand-accent/50' 
                      : 'bg-brand-primary text-white border-brand-primary-hover'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Body summary */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-brand-primary tracking-tight transition-colors">
                      {report.name}
                    </h3>
                    <span className="text-[10px] text-brand-primary font-bold bg-brand-primary-light px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#E9E1D4]">
                      {report.type}
                    </span>
                  </div>

                  <p className="text-xxs text-brand-secondary font-semibold flex items-center pt-1 leading-snug">
                    <MapPin className="h-3.5 w-3.5 text-brand-secondary opacity-60 mr-1 flex-shrink-0" />
                    <span className="truncate max-w-[200px]">{report.location}</span>
                  </p>
                </div>

                {/* Small Description preview snippet */}
                <p className="text-xxs text-brand-secondary/80 line-clamp-2 leading-relaxed">
                  {report.description || 'Sin descripción adicional.'}
                </p>

                {/* Footer action date & button */}
                <div className="pt-4 border-t border-[#E9E1D4] flex items-center justify-between text-[10px] text-brand-secondary font-bold">
                  <span>{report.date}</span>
                  
                  <span className="inline-flex items-center text-brand-primary group-hover:underline decoration-2 underline-offset-4 cursor-pointer">
                    Ver Detalles
                    <Eye className="h-3.5 w-3.5 ml-1" />
                  </span>
                </div>

              </div>

            </motion.div>
          ))}

        </div>
      ) : (
        <div className="p-16 bg-white border border-[#E9E1D4] rounded-[24px] text-center space-y-4 shadow-sm">
          <BookOpen className="h-12 w-12 text-brand-secondary opacity-60 mx-auto" />
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-base font-bold text-brand-primary">Sin reportes registrados</h4>
            <p className="text-xs text-brand-secondary">
              No encontramos reportes activos que coincidan con la búsqueda. Prueba seleccionando otra categoría o borrando los filtros activos.
            </p>
          </div>
        </div>
      )}

      {/* Details Dialog overlay (Full high-fidelity card overlay) */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-brand-primary"
            />

            {/* Modal Body Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-[24px] shadow-lg overflow-hidden border border-[#E9E1D4] flex flex-col max-h-[90vh]"
            >
              
              {/* Image Banner header block */}
              <div className="aspect-[16/10] w-full relative bg-[#FDFBF7]">
                <img 
                  src={selectedReport.photo} 
                  alt={selectedReport.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Header Close triggers */}
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="absolute top-4 right-4 p-2 bg-brand-primary/60 hover:bg-brand-primary/80 rounded-full text-white backdrop-blur-sm transition-all border-0"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Status Badges overlays */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  <span className={`inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-md ${
                    selectedReport.status === 'Perdido' 
                      ? 'bg-brand-accent text-white border-brand-accent/50' 
                      : 'bg-brand-primary text-white border-brand-primary-hover'
                  }`}>
                    {selectedReport.status}
                  </span>
                  
                  <span className="bg-brand-primary/75 text-white text-xs px-3.5 py-1 rounded-xl border border-white/20 shadow-md backdrop-blur-sm font-bold flex items-center">
                    <Compass className="h-3.5 w-3.5 mr-1 text-[#D9C5B2]" />
                    Habilitado en Mapa
                  </span>
                </div>
              </div>

              {/* Contents block scrollable body */}
              <div className="p-6 overflow-y-auto space-y-6 bg-white">
                
                {/* Titles */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-serif italic text-brand-primary">
                      Ficha de Identificación: {selectedReport.name}
                    </h3>
                    <span className="text-xxs font-bold text-brand-secondary">
                      SKU: #{selectedReport.id}
                    </span>
                  </div>

                  {/* Badget details pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] font-medium text-brand-secondary bg-[#FDFBF7] border border-[#E9E1D4] px-3 py-1 rounded-lg">
                      Especie: <strong className="text-brand-primary">{selectedReport.type}</strong>
                    </span>
                    <span className="text-[10px] font-medium text-brand-secondary bg-[#FDFBF7] border border-[#E9E1D4] px-3 py-1 rounded-lg">
                      Dimensión: <strong className="text-brand-primary">{selectedReport.size}</strong>
                    </span>
                    <span className="text-[10px] font-medium text-brand-secondary bg-[#FDFBF7] border border-[#E9E1D4] px-3 py-1 rounded-lg">
                      Reportado: <strong className="text-brand-primary">{selectedReport.date}</strong>
                    </span>
                  </div>
                </div>

                {/* Señas Particulares */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">
                    Señas Particulares & Detalles:
                  </h4>
                  <p className="text-xs text-[#2D2D2D] leading-relaxed bg-[#FDFBF7] p-4 border border-[#E9E1D4] rounded-xl font-medium">
                    {selectedReport.description}
                  </p>
                </div>

                {/* Location specific info */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">
                    Último punto de avistamiento:
                  </h4>
                  <div className="p-4 bg-brand-primary-light border border-[#E9E1D4] text-[#2D2D2D] rounded-xl flex items-center space-x-3 text-xs font-medium">
                    <MapPin className="h-5 w-5 text-brand-primary flex-shrink-0" />
                    <span>{selectedReport.location}</span>
                  </div>
                </div>

                {/* Reporter / Contact Information section */}
                <div className="p-4 bg-brand-primary-light border border-[#E9E1D4] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-brand-secondary uppercase tracking-wider">¿Tienes información? Contacto:</p>
                    <p className="text-xs font-bold text-brand-primary">{selectedReport.reporter}</p>
                    <p className="text-[10px] text-brand-secondary font-semibold">{selectedReport.reporterEmail}</p>
                  </div>

                  <div className="flex space-x-2 w-full sm:w-auto">
                    <a 
                      href={`mailto:${selectedReport.reporterEmail}?subject=Sanos y Salvos - Info sobre ${selectedReport.name}`}
                      className="flex-1 sm:flex-none h-9 px-4 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl text-xxs font-bold flex items-center justify-center space-x-1.5 shadow-sm uppercase tracking-wider border-0"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Contactar</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#E9E1D4] bg-[#FDFBF7] flex justify-end">
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-white border border-[#E9E1D4] text-brand-secondary hover:text-[#2D2D2D] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cerrar Ventana
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
