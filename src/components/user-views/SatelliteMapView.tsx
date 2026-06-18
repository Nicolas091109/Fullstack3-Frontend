import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Report } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Compass, Search, Filter, Camera, Shield, Eye, Calendar, Map, CheckCircle2, Info, Navigation
} from 'lucide-react';
import chileMap from '../../../assets/chile_satellite_map.png';

export const SatelliteMapView: React.FC = () => {
  const { reports } = useApp();
  const [selectedPin, setSelectedPin] = useState<Report | null>(null);
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'street' | 'terrain'>('satellite');

  // Simulated locations mapped out on Chile coordinates
  const simulatedMapBackgrounds = {
    satellite: 'bg-[#1C241E]', // deep dark forest soil
    street: 'bg-[#FDFBF7]', // clean warm land
    terrain: 'bg-brand-primary-light/40' // relief style
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-[24px] border border-[#E9E1D4] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-serif text-brand-primary italic">Geolocalización: Mapa Satelital de Alertas</h2>
          <p className="text-xs text-brand-secondary leading-relaxed font-semibold font-sans">
            Visualiza y rastrea los pines y coordenadas geográficas de mascotas extraviadas o avistadas recientemente en tiempo real.
          </p>
        </div>

        {/* Map Layer Controls */}
        <div className="flex bg-brand-primary-light border border-[#E9E1D4] p-1 rounded-xl w-full md:w-auto">
          <button 
            type="button"
            onClick={() => setActiveLayer('satellite')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeLayer === 'satellite'
                ? 'bg-brand-tertiary text-white shadow-sm'
                : 'text-brand-secondary hover:text-brand-primary'
            }`}
          >
            Satelital
          </button>
          <button 
            type="button"
            onClick={() => setActiveLayer('street')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeLayer === 'street'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-secondary hover:text-brand-primary'
            }`}
          >
            Calles
          </button>
          <button 
            type="button"
            onClick={() => setActiveLayer('terrain')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeLayer === 'terrain'
                ? 'bg-brand-secondary text-white shadow-sm'
                : 'text-brand-secondary hover:text-brand-primary'
            }`}
          >
            Relieve
          </button>
        </div>
      </div>

      {/* Main Map Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Outer Map Container (Simulating GIS panel) */}
        <div className="lg:col-span-8 flex flex-col">
          
          <div className="relative aspect-[16/10] w-full bg-[#1C241E] rounded-[24px] overflow-hidden border border-[#E9E1D4] flex flex-col shadow-sm">
            
            {/* Satellite topographic background layer */}
            <div className={`absolute inset-0 transition-all duration-500 ${simulatedMapBackgrounds[activeLayer]}`}>
              
              {/* Satellite topography mock imagery pattern */}
              {activeLayer === 'satellite' && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-90" 
                  style={{ backgroundImage: `url(${chileMap})` }}
                />
              )}

              {activeLayer === 'street' && (
                <>
                  <div className="absolute inset-0 bg-[#FDFBF7]" />
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#E9E1D4_1px,transparent_1px),linear-gradient(90deg,#E9E1D4_1px,transparent_1px)] bg-[size:30px_30px]" />
                  <div className="absolute w-full h-8 bg-brand-primary-light top-1/3 left-0 transform -skew-y-12 flex items-center justify-center text-[8px] font-mono font-bold text-brand-secondary uppercase tracking-widest leading-none select-none">
                    AV. LIBERTADOR BERNARDO O'HIGGINS
                  </div>
                  <div className="absolute w-12 h-full bg-brand-primary-light left-1/2 top-0 transform skew-x-6 flex items-center justify-center text-[8px] font-mono font-bold text-brand-secondary uppercase tracking-widest leading-none select-none font-semibold">
                    AV. AMÉRICO VESPUCIO
                  </div>
                </>
              )}

              {activeLayer === 'terrain' && (
                <>
                  <div className="absolute inset-0 bg-[#1C241E]" />
                  <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_at_center,rgba(74,93,78,0.35)_0%,transparent_60%)]" />
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(74,93,78,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(74,93,78,0.25)_1px,transparent_1px)] bg-[size:40px_40px]" />
                </>
              )}

            </div>

            {/* Top hud bar overlay */}
            <div className="absolute top-4 left-4 z-10 p-3 bg-white/95 text-brand-primary backdrop-blur-md rounded-2xl border border-[#E9E1D4] flex items-center space-x-3 shadow-sm max-w-[280px]">
              <Compass className="h-4 w-4 text-brand-primary fill-none animate-spin-slow flex-shrink-0" />
              <div className="overflow-hidden leading-tight font-sans">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary font-sans">Chile Centro Satelital</p>
                <p className="text-[11px] text-brand-secondary font-semibold truncate mt-0.5">Mostrando {reports.length} reportes geolocalizados</p>
              </div>
            </div>

            {/* Simulated Live Grid HUD */}
            <div className="absolute bottom-4 left-4 z-10 p-2.5 bg-white/90 text-brand-primary backdrop-blur-md rounded-xl text-[9px] font-mono border border-[#E9E1D4] flex space-x-4 font-bold">
              <span>LAT: 33.4489° S</span>
              <span>LON: 70.6693° W</span>
              <span className="text-brand-accent font-bold">ALT: 570m</span>
            </div>

            {/* Live Interactive Pins */}
            {reports.map((report) => {
              const isSelected = selectedPin?.id === report.id;
              
              return (
                <motion.div
                  key={report.id}
                  className="absolute cursor-pointer select-none group z-20"
                  style={{ left: `${report.mapX}%`, top: `${report.mapY}%` }}
                  onClick={() => setSelectedPin(report)}
                  whileHover={{ scale: 1.15 }}
                >
                  <div className="relative">
                    {/* Pulsing ring */}
                    <span className={`absolute -inset-2.5 rounded-full inline-flex opacity-75 animate-ping ${
                      report.status === 'Perdido' ? 'bg-brand-accent' : 'bg-brand-primary'
                    }`} />

                    {/* Outer marker pin */}
                    <div className={`w-5 h-5 rounded-full border border-white shadow-md flex items-center justify-center font-bold text-[10px] text-white transition-all ${
                      isSelected 
                        ? 'bg-brand-tertiary scale-110 border-white ring-2 ring-brand-primary' 
                        : report.status === 'Perdido' 
                          ? 'bg-brand-accent hover:opacity-95' 
                          : 'bg-brand-primary hover:opacity-95'
                    }`}>
                      {report.name.slice(0, 1).toUpperCase()}
                    </div>

                    {/* Small visual hover name identifier */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-6 scale-0 group-hover:scale-100 transition-all px-2 py-0.5 bg-white/90 text-brand-primary text-[9px] font-bold rounded shadow-sm border border-[#E9E1D4] whitespace-nowrap z-30">
                      {report.name} ({report.status})
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Gray placeholder footer simulating satellite coordinates */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/80 border border-[#E9E1D4] text-brand-secondary text-[8px] rounded-lg backdrop-blur-sm select-none font-bold tracking-wider font-mono">
              WGS84 GPS ENGINE
            </div>

          </div>
        </div>

        {/* Right Column: GIS Active Node Inspector (Dynamic detail box based on selected Pin!) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="bg-white border border-[#E9E1D4] rounded-[24px] p-6 shadow-sm flex-1 flex flex-col justify-between min-h-[300px]">
            
            <AnimatePresence mode="wait">
              {selectedPin ? (
                <motion.div 
                  key={selectedPin.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  {/* Top: Pet micro details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                          selectedPin.status === 'Perdido' 
                            ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' 
                            : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                        }`}>
                          {selectedPin.status}
                        </span>
                        
                        <h4 className="text-base font-serif italic text-brand-primary mt-1">
                          {selectedPin.name}
                        </h4>
                      </div>

                      <button 
                        onClick={() => setSelectedPin(null)}
                        className="text-brand-secondary hover:text-brand-primary p-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-0 bg-transparent"
                      >
                        Quitar
                      </button>
                    </div>

                    {/* Pet Image crop */}
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#E9E1D4] relative bg-[#FDFBF7] shadow-sm">
                      <img 
                        src={selectedPin.photo} 
                        alt={selectedPin.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details table block */}
                    <div className="space-y-1.5 text-xs text-brand-secondary font-semibold p-3 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl font-sans">
                      <div className="flex justify-between py-1 border-b border-[#E9E1D4]">
                        <span className="text-brand-secondary/80">Especie:</span>
                        <span className="font-bold text-brand-primary">{selectedPin.type}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#E9E1D4]">
                        <span className="text-brand-secondary/80">Tamaño:</span>
                        <span className="font-bold text-brand-primary">{selectedPin.size}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-brand-secondary/80">Fecha Alerta:</span>
                        <span className="font-bold text-brand-primary">{selectedPin.date.split(',')[0]}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#2D2D2D] italic line-clamp-3 bg-brand-primary-light/50 p-3 rounded-lg leading-relaxed border border-[#E9E1D4] font-medium">
                      "{selectedPin.description}"
                    </p>
                  </div>

                  {/* Call to action contact trigger */}
                  <div className="pt-4 border-t border-[#E9E1D4] flex items-center space-x-2">
                    <div className="flex-1 text-[9px] font-bold text-brand-secondary uppercase tracking-wide">
                      ZONA: <strong className="text-brand-primary block text-[11px] truncate max-w-[120px] font-bold">{selectedPin.location}</strong>
                    </div>
                    
                    <a 
                      href={`mailto:${selectedPin.reporterEmail}?subject=Sanos y Salvos - Reporte de ${selectedPin.name}`}
                      className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-[#FDFBF7] rounded-xl text-[10px] font-bold tracking-wider uppercase flex items-center space-x-1.5 shadow-sm border-0"
                    >
                      <span>Mensaje</span>
                    </a>
                  </div>

                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 my-auto text-center"
                >
                  <Navigation className="h-8 w-8 text-brand-secondary opacity-60 mx-auto animate-pulse" />
                  <div className="space-y-1 max-w-[220px] mx-auto">
                    <p className="text-xs font-bold text-brand-primary font-serif italic">Explorar Marcadores</p>
                    <p className="text-[11px] text-brand-secondary leading-relaxed font-sans font-semibold">
                      Haz clic sobre cualquiera de los pines del mapa para ver los detalles, la fotografía y el contacto de la mascota cargada.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

    </div>
  );
};
