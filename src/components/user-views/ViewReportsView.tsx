import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Report } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, MapPin, Calendar, Compass, 
  Info, Eye, X, BookOpen, AlertCircle, Sparkles, Smile, MessageSquare, PhoneCall,
  Camera, CheckCircle, HelpCircle
} from 'lucide-react';

export const ViewReportsView: React.FC = () => {
  const { reports, user, addComment, updateReport } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Comments input states
  const [commentText, setCommentText] = useState('');
  const [commentPhoto, setCommentPhoto] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !commentText.trim()) return;

    try {
      await addComment(selectedReport.id, commentText, commentPhoto);
      
      const newComment = {
        id: Math.random().toString(),
        texto: commentText,
        foto: commentPhoto,
        usuarioId: user?.id || 0,
        usuarioNombre: user?.name || 'Vecino Anónimo',
        fechaRegistro: new Date().toISOString()
      };
      
      setSelectedReport({
        ...selectedReport,
        comments: [...(selectedReport.comments || []), newComment]
      });

      setCommentText('');
      setCommentPhoto(undefined);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCommentPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleStatus = async () => {
    if (!selectedReport) return;
    try {
      const newStatus = selectedReport.status === 'Perdido' ? 'Encontrado' : 'Perdido';
      const updated = {
        ...selectedReport,
        status: newStatus
      };
      await updateReport(updated);
      setSelectedReport(updated);
    } catch (err) {
      console.error(err);
    }
  };

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
              <div className="h-48 sm:h-60 w-full relative bg-[#FDFBF7] overflow-hidden">
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
                    {user && selectedReport.originalUsuarioId === user.id ? (
                      <button 
                        onClick={handleToggleStatus}
                        className={`flex-1 sm:flex-none h-9 px-4 rounded-xl text-xxs font-bold flex items-center justify-center space-x-1.5 shadow-sm uppercase tracking-wider border-0 cursor-pointer text-white ${
                          selectedReport.status === 'Perdido'
                            ? 'bg-brand-primary hover:bg-brand-primary-hover'
                            : 'bg-brand-accent hover:bg-brand-accent/90'
                        }`}
                      >
                        {selectedReport.status === 'Perdido' ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Marcar como Encontrado</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span>Marcar como Perdido</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          if (user) {
                            navigate('/usuario/chats', { 
                              state: { 
                                startChatWith: { 
                                  id: selectedReport.originalUsuarioId, 
                                  name: selectedReport.reporter 
                                } 
                              } 
                            });
                          } else {
                            navigate('/login');
                          }
                        }}
                        className="flex-1 sm:flex-none h-9 px-4 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl text-xxs font-bold flex items-center justify-center space-x-1.5 shadow-sm uppercase tracking-wider border-0 cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Chat Privado</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-4 pt-4 border-t border-[#E9E1D4]">
                  <h4 className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1 text-brand-secondary opacity-60" />
                    Avistamientos y Comentarios de la Comunidad:
                  </h4>

                  {/* List of comments */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {selectedReport.comments && selectedReport.comments.length > 0 ? (
                      selectedReport.comments.map((comment, index) => (
                        <div key={comment.id || index} className="p-3 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] text-brand-secondary font-bold">
                            <span className="text-brand-primary">{comment.usuarioNombre}</span>
                            <span>{new Date(comment.fechaRegistro).toLocaleString('es-MX', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                          <p className="text-xs text-[#2D2D2D] leading-relaxed font-medium">
                            {comment.texto}
                          </p>
                          {comment.foto && (
                            <div className="relative mt-2 max-w-xs overflow-hidden rounded-lg border border-[#E9E1D4]">
                              <img 
                                src={comment.foto} 
                                alt="Evidencia de avistamiento" 
                                className="w-full object-cover max-h-40"
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xxs text-brand-secondary italic text-center py-4 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl">
                        Nadie ha comentado todavía. Si tienes alguna pista o foto, ¡compártela!
                      </p>
                    )}
                  </div>

                  {/* Add comment Form */}
                  {user && (
                    <form onSubmit={handleCommentSubmit} className="space-y-3 pt-2">
                      <div className="relative">
                        <textarea
                          rows={2}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="¿Viste a la mascota? Comenta aquí detalles, dirección o estado..."
                          className="w-full p-3 bg-white border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold text-[#2D2D2D]"
                          required
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-9 px-3 bg-[#FDFBF7] border border-[#E9E1D4] hover:bg-[#F5F2ED] text-brand-secondary rounded-xl text-xxs font-bold flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Camera className="h-3.5 w-3.5" />
                            <span>Adjuntar Foto</span>
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                          {commentPhoto && (
                            <span className="text-[10px] text-brand-primary font-bold bg-brand-primary-light px-2.5 py-0.5 rounded-full border border-[#E9E1D4] flex items-center">
                              Foto cargada
                              <button
                                type="button"
                                onClick={() => setCommentPhoto(undefined)}
                                className="ml-1 text-red-500 font-bold hover:text-red-700"
                              >
                                ×
                              </button>
                            </span>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full sm:w-auto h-9 px-4 bg-brand-primary hover:bg-brand-primary-hover text-[#FDFBF7] rounded-xl text-xxs font-bold flex items-center justify-center space-x-1 shadow-sm uppercase tracking-wider border-0 cursor-pointer"
                        >
                          Comentar
                        </button>
                      </div>
                    </form>
                  )}
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
