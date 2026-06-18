import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Edit3, Shield, Search, Filter, Plus, 
  MapPin, Calendar, User, Eye, X, Check, CheckCircle, Save
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { reports, usersList, geoList, deleteReport, updateReport } = useApp();
  const [activeTab, setActiveTab] = useState<'reportes' | 'usuarios' | 'geolocalizacion'>('reportes');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingReport, setEditingReport] = useState<any | null>(null);
  
  // Local form state for edit modal
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'Perro' | 'Gato' | 'Exótico' | 'Otro'>('Perro');
  const [editSize, setEditSize] = useState<'Pequeño' | 'Mediano' | 'Grande'>('Mediano');
  const [editStatus, setEditStatus] = useState<'Perdido' | 'Encontrado'>('Perdido');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [notification, setNotification] = useState('');

  // Handle delete action
  const handleDelete = (id: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el reporte #${id}?`)) {
      deleteReport(id);
      showNotification('Reporte eliminado con éxito.');
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Open Edit Modal
  const handleEditOpen = (report: any) => {
    setEditingReport(report);
    setEditName(report.name);
    setEditType(report.type);
    setEditSize(report.size);
    setEditStatus(report.status);
    setEditLocation(report.location);
    setEditDescription(report.description);
  };

  // Submit Edit Form
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    const updated = {
      ...editingReport,
      name: editName,
      type: editType,
      size: editSize,
      status: editStatus,
      location: editLocation,
      description: editDescription
    };

    updateReport(updated);
    setEditingReport(null);
    showNotification('Reporte actualizado con éxito.');
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'perdido' && r.status === 'Perdido') ||
      (filterType === 'encontrado' && r.status === 'Encontrado') ||
      (filterType === 'perro' && r.type === 'Perro') ||
      (filterType === 'gato' && r.type === 'Gato');

    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const totalCount = reports.length;
  const lostCount = reports.filter(r => r.status === 'Perdido').length;
  const foundCount = reports.filter(r => r.status === 'Encontrado').length;
  const dogsCount = reports.filter(r => r.type === 'Perro').length;
  const catsCount = reports.filter(r => r.type === 'Gato').length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 sm:p-6 lg:p-8">
      
      {/* Alert toast notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-6 z-50 px-5 py-3 bg-brand-primary text-[#FDFBF7] border border-[#E9E1D4] rounded-2xl shadow-lg flex items-center space-x-3 text-xs font-bold"
          >
            <CheckCircle className="h-4 w-4 text-[#D9C5B2]" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-2 text-brand-primary">
              <Shield className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Panel de Administración</span>
            </div>
            <h1 className="text-3xl font-serif text-brand-primary italic mt-1">
              Consola de Moderación y Control
            </h1>
            <p className="text-xs text-brand-secondary/90 leading-relaxed font-semibold mt-1">
              Administración central de reportes comunitarios activos, verificación y estados del programa.
            </p>
          </div>
        </div>

        {/* Dynamic Bento Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="bg-white p-6 rounded-[24px] border border-[#E9E1D4] shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-medium text-brand-secondary uppercase tracking-wider">Reportes Activos</span>
            <span className="text-3xl font-serif italic text-brand-primary mt-2">{totalCount}</span>
            <span className="text-[10px] text-brand-primary font-semibold mt-1">Registrados en total</span>
          </div>

          <div className="bg-[#C05D4D]/5 p-6 rounded-[24px] border border-brand-accent/20 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-medium text-brand-accent uppercase tracking-wider">Altas de Extravío</span>
            <span className="text-3xl font-serif italic text-brand-accent mt-2">{lostCount}</span>
            <span className="text-[10px] text-brand-accent font-semibold mt-1">Mascotas perdidas</span>
          </div>

          <div className="bg-brand-primary-light/40 p-6 rounded-[24px] border border-[#E9E1D4] shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-medium text-brand-primary uppercase tracking-wider">Avistados / Salvo</span>
            <span className="text-3xl font-serif italic text-brand-primary mt-2">{foundCount}</span>
            <span className="text-[10px] text-brand-primary font-semibold mt-1">Mascotas a salvo</span>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-[#E9E1D4] shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-medium text-brand-secondary uppercase tracking-wider">Censo Perros</span>
            <span className="text-3xl font-serif italic text-brand-primary mt-2">{dogsCount}</span>
            <span className="text-[10px] text-brand-secondary font-semibold mt-1">Caninos reportados</span>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-[#E9E1D4] shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-medium text-brand-secondary uppercase tracking-wider">Censo Gatos</span>
            <span className="text-3xl font-serif italic text-brand-primary mt-2">{catsCount}</span>
            <span className="text-[10px] text-brand-secondary font-semibold mt-1">Felinos registrados</span>
          </div>

        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex bg-white rounded-[24px] border border-[#E9E1D4] p-1.5 shadow-sm space-x-1.5 overflow-x-auto mb-6">
          <button
            onClick={() => setActiveTab('reportes')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'reportes'
                ? 'bg-brand-primary text-[#FDFBF7] shadow-sm'
                : 'text-brand-secondary hover:text-brand-primary hover:bg-[#F5F2ED]'
            }`}
          >
            <Shield className="h-4 w-4 flex-shrink-0" />
            <span>Mascotas Reportadas</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'reportes' ? 'bg-white/20 text-[#FDFBF7]' : 'bg-brand-primary-light border border-[#E9E1D4] text-brand-secondary'
            }`}>
              {reports.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'usuarios'
                ? 'bg-brand-primary text-[#FDFBF7] shadow-sm'
                : 'text-brand-secondary hover:text-brand-primary hover:bg-[#F5F2ED]'
            }`}
          >
            <User className="h-4 w-4 flex-shrink-0" />
            <span>Usuarios de la Comunidad</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'usuarios' ? 'bg-white/20 text-[#FDFBF7]' : 'bg-brand-primary-light border border-[#E9E1D4] text-brand-secondary'
            }`}>
              {usersList.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('geolocalizacion')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'geolocalizacion'
                ? 'bg-brand-primary text-[#FDFBF7] shadow-sm'
                : 'text-brand-secondary hover:text-brand-primary hover:bg-[#F5F2ED]'
            }`}
          >
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>Historial Geográfico</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'geolocalizacion' ? 'bg-white/20 text-[#FDFBF7]' : 'bg-brand-primary-light border border-[#E9E1D4] text-brand-secondary'
            }`}>
              {geoList.length}
            </span>
          </button>
        </div>

        {activeTab === 'reportes' && (
          <div className="bg-white rounded-[24px] border border-[#E9E1D4] shadow-sm overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-6 border-b border-[#E9E1D4] flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 bg-[#FDFBF7]">
            
            <h2 className="text-lg font-serif italic text-brand-primary">Directorio de Reportes</h2>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              
              {/* Search input */}
              <div className="relative flex-1 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
                  <Search className="h-4 w-4" />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por ID, nombre, reportero..."
                  className="w-full pl-10 pr-4 h-11 bg-white border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold text-[#2D2D2D]"
                />
              </div>

              {/* Filter controls */}
              <div className="flex items-center space-x-2">
                <div className="p-2.5 bg-white border border-[#E9E1D4] rounded-xl text-brand-secondary">
                  <Filter className="h-4 w-4" />
                </div>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-white border border-[#E9E1D4] rounded-xl h-11 px-3 pr-8 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-bold text-brand-secondary"
                >
                  <option value="all">Ver Todos</option>
                  <option value="perdido">Solo Perdidos</option>
                  <option value="encontrado">Solo Encontrados</option>
                  <option value="perro">Solo Perros</option>
                  <option value="gato">Solo Gatos</option>
                </select>
              </div>

            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {filteredReports.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[900px] font-sans">
                <thead>
                  <tr className="bg-[#FDFBF7] text-brand-secondary text-[10px] font-bold uppercase tracking-wider border-b border-[#E9E1D4]">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Foto</th>
                    <th className="px-6 py-4">Mascota / Especie</th>
                    <th className="px-6 py-4">Zona / Dirección</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Fecha de Reporte</th>
                    <th className="px-6 py-4">Levantado Por</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E1D4]">
                  {filteredReports.map((report) => (
                    <motion.tr 
                      key={report.id}
                      layout
                      className="hover:bg-brand-primary-light/30 transition-colors group"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 text-xs font-bold text-brand-primary">
                        #{report.id}
                      </td>

                      {/* Photo Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E9E1D4] shadow-sm relative bg-[#FDFBF7]">
                          <img 
                            src={report.photo} 
                            alt={report.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      </td>

                      {/* Name / Breed */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-brand-primary">{report.name}</div>
                        <div className="text-[10px] text-brand-secondary font-semibold flex items-center space-x-1.5 mt-0.5">
                          <span>{report.type}</span>
                          <span className="w-1 h-1 rounded-full bg-brand-secondary/30" />
                          <span>{report.size}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="text-xs text-[#2D2D2D] font-semibold flex items-center space-x-1">
                          <MapPin className="h-3.5 w-3.5 text-brand-secondary/60 flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{report.location}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                          report.status === 'Perdido' 
                            ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' 
                            : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            report.status === 'Perdido' ? 'bg-brand-accent' : 'bg-brand-primary'
                          }`} />
                          {report.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="text-xs text-brand-secondary font-semibold flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5 text-brand-secondary/60 flex-shrink-0" />
                          <span>{report.date}</span>
                        </div>
                      </td>

                      {/* Reporter Information */}
                      <td className="px-6 py-4">
                        <div className="text-xs text-brand-primary font-bold flex items-center space-x-1">
                          <User className="h-3.5 w-3.5 text-brand-secondary/60 flex-shrink-0" />
                          <span>{report.reporter}</span>
                        </div>
                        <div className="text-[10px] text-brand-secondary font-semibold mt-0.5 ml-4.5 truncate max-w-[140px]">
                          {report.reporterEmail}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-1">
                          
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditOpen(report)}
                            title="Editar Reporte"
                            className="p-2 text-brand-primary hover:bg-brand-primary-light border border-transparent rounded-xl cursor-pointer"
                          >
                            <Edit3 className="h-4 w-4" />
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(report.id)}
                            title="Eliminar Reporte"
                            className="p-2 text-brand-accent hover:bg-red-50 border border-transparent rounded-xl cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>

                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-3">
                <Search className="h-10 w-10 text-brand-secondary opacity-60 mx-auto" />
                <p className="text-sm font-bold text-brand-primary">No se encontraron reportes</p>
                <p className="text-xs text-brand-secondary">Intenta modificando los filtros o borrando el término de la barra de búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'usuarios' && (
        <div className="bg-white rounded-[24px] border border-[#E9E1D4] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E9E1D4] bg-[#FDFBF7]">
            <h2 className="text-lg font-serif italic text-brand-primary">Directorio de Usuarios</h2>
            <p className="text-xs text-brand-secondary font-semibold">Lista completa de vecinos registrados en la plataforma.</p>
          </div>
          <div className="overflow-x-auto">
            {usersList.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[700px] font-sans">
                <thead>
                  <tr className="bg-[#FDFBF7] text-brand-secondary text-[10px] font-bold uppercase tracking-wider border-b border-[#E9E1D4]">
                    <th className="px-6 py-4">ID de Base de Datos</th>
                    <th className="px-6 py-4">Nombre Completo</th>
                    <th className="px-6 py-4">Correo Electrónico</th>
                    <th className="px-6 py-4">Rol / Privilegios</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E1D4]">
                  {usersList.map((u: any) => (
                    <tr key={u.id} className="hover:bg-brand-primary-light/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-brand-primary">#{u.id}</td>
                      <td className="px-6 py-4 text-xs font-bold text-[#2D2D2D]">{u.nombre}</td>
                      <td className="px-6 py-4 text-xs text-brand-secondary font-semibold">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                          u.rol === 'ADMIN' 
                            ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' 
                            : 'bg-brand-primary-light/50 text-brand-secondary border-[#E9E1D4]'
                        }`}>
                          {u.rol === 'ADMIN' ? (
                            <>
                              <Shield className="h-3.5 w-3.5 mr-1.5 fill-current text-brand-primary" />
                              Administrador (Dios)
                            </>
                          ) : (
                            'Vecino (USER)'
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-3">
                <p className="text-sm font-bold text-brand-primary">No se encontraron usuarios</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'geolocalizacion' && (
        <div className="bg-white rounded-[24px] border border-[#E9E1D4] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E9E1D4] bg-[#FDFBF7]">
            <h2 className="text-lg font-serif italic text-brand-primary">Historial de Geolocalizaciones</h2>
            <p className="text-xs text-brand-secondary font-semibold">Coordenadas y sectores geográficos vinculados a reportes comunitarios.</p>
          </div>
          <div className="overflow-x-auto">
            {geoList.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[700px] font-sans">
                <thead>
                  <tr className="bg-[#FDFBF7] text-brand-secondary text-[10px] font-bold uppercase tracking-wider border-b border-[#E9E1D4]">
                    <th className="px-6 py-4">ID de Ubicación</th>
                    <th className="px-6 py-4">Nombre del Sector / Dirección</th>
                    <th className="px-6 py-4">Coordenada X (Longitud)</th>
                    <th className="px-6 py-4">Coordenada Y (Latitud)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E1D4]">
                  {geoList.map((g: any) => (
                    <tr key={g.id} className="hover:bg-brand-primary-light/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-brand-primary">#{g.id}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-[#2D2D2D]">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="h-3.5 w-3.5 text-brand-primary" />
                          <span>{g.nombreSector}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono font-bold text-brand-secondary">{g.longitud}%</td>
                      <td className="px-6 py-4 text-xs font-mono font-bold text-brand-secondary">{g.latitud}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-3">
                <p className="text-sm font-bold text-brand-primary">No se encontraron registros geográficos</p>
              </div>
            )}
          </div>
        </div>
      )}

      </div>

      {/* Edit Modal (Operational state edit) */}
      <AnimatePresence>
        {editingReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingReport(null)}
              className="absolute inset-0 bg-brand-primary"
            />

            {/* Form Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E9E1D4] flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[#E9E1D4] flex justify-between items-center bg-[#FDFBF7]">
                <div>
                  <h3 className="text-base font-serif italic text-brand-primary">
                    Editar Reporte #{editingReport.id}
                  </h3>
                  <p className="text-xs text-brand-secondary">Modifica los campos del reporte de forma instantánea.</p>
                </div>
                <button 
                  onClick={() => setEditingReport(null)}
                  className="p-1.5 hover:bg-brand-primary-light rounded-xl text-brand-secondary transition-colors cursor-pointer border-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 gap-y-4 flex flex-col overflow-y-auto">
                <div className="flex justify-center mb-2">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#E9E1D4] relative shadow-sm">
                    <img 
                      src={editingReport.photo} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 py-0.5 bg-brand-primary/80 text-[#FDFBF7] text-[8px] text-center font-semibold">
                      Imagen fija
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-secondary uppercase block pl-1">Nombre mascota</label>
                  <input 
                    type="text" 
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-11 px-3 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold text-[#2D2D2D]"
                  />
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-secondary uppercase block pl-1">Tipo Animal</label>
                    <select 
                      value={editType}
                      onChange={(e: any) => setEditType(e.target.value)}
                      className="w-full h-11 px-3 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold text-brand-secondary"
                    >
                      <option value="Perro">Perro</option>
                      <option value="Gato">Gato</option>
                      <option value="Exótico">Exótico</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-secondary uppercase block pl-1">Tamaño</label>
                    <select 
                      value={editSize}
                      onChange={(e: any) => setEditSize(e.target.value)}
                      className="w-full h-11 px-3 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold text-brand-secondary"
                    >
                      <option value="Pequeño">Pequeño</option>
                      <option value="Mediano">Mediano</option>
                      <option value="Grande">Grande</option>
                    </select>
                  </div>
                </div>

                {/* Status Toggle buttons */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-secondary uppercase block pl-1">Condición</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => setEditStatus('Perdido')}
                      className={`h-11 text-xs font-semibold rounded-xl border flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        editStatus === 'Perdido'
                          ? 'border-brand-accent/30 bg-brand-accent/10 text-brand-accent font-bold shadow-sm'
                          : 'border-[#E9E1D4] bg-white text-brand-secondary hover:text-brand-primary'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-accent" />
                      <span>Perdido</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setEditStatus('Encontrado')}
                      className={`h-11 text-xs font-semibold rounded-xl border flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        editStatus === 'Encontrado'
                          ? 'border-brand-primary/30 bg-brand-primary-light text-brand-primary font-bold shadow-sm'
                          : 'border-[#E9E1D4] bg-white text-brand-secondary hover:text-brand-primary'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-primary" />
                      <span>Encontrado</span>
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-secondary uppercase block pl-1">Zona o dirección</label>
                  <input 
                    type="text" 
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full h-11 px-3 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold text-[#2D2D2D]"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-secondary uppercase block pl-1">Características y detalles</label>
                  <textarea 
                    rows={3}
                    required
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold text-[#2D2D2D] resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-3">
                  <button 
                    type="button"
                    onClick={() => setEditingReport(null)}
                    className="flex-1 h-11 bg-brand-primary-light text-brand-secondary hover:text-brand-primary rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 h-11 bg-brand-primary hover:bg-brand-primary-hover text-[#FDFBF7] rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer border-0"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
