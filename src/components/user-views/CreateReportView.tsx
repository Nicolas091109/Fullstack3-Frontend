import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, MapPin, Upload, Info, HeartHandshake, CheckCircle2, AlertCircle 
} from 'lucide-react';
import chileMap from '../../../assets/chile_satellite_map.png';

export const CreateReportView: React.FC = () => {
  const { addReport } = useApp();
  
  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<'Perro' | 'Gato' | 'Exótico' | 'Otro'>('Perro');
  const [size, setSize] = useState<'Pequeño' | 'Mediano' | 'Grande'>('Mediano');
  const [status, setStatus] = useState<'Perdido' | 'Encontrado'>('Perdido');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string>('');
  
  // Custom Map Coordinate Selector
  const [mapX, setMapX] = useState<number>(50); // percentage
  const [mapY, setMapY] = useState<number>(50); // percentage

  // UI state
  const [isDragActive, setIsDragActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read file as base64 for preview and simulation storage
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona únicamente archivos de imagen (png, jpeg, webp).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo supera el límite de 5MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Submit report
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!photo) {
      setError('La fotografía de la mascota es obligatoria para ayudar en su identificación.');
      return;
    }
    if (!name.trim()) {
      setError('Por favor aporta un nombre para la mascota (o ingresa "Desconocido").');
      return;
    }
    if (!location.trim()) {
      setError('Proporciona la última ubicación de avistamiento para guiar las brigadas.');
      return;
    }

    // Add report using context
    addReport({
      name: name.trim(),
      type,
      size,
      status,
      location: location.trim(),
      description: description.trim(),
      photo,
      mapX,
      mapY
    });

    setSuccess(true);
    
    // Reset fields
    setName('');
    setType('Perro');
    setSize('Mediano');
    setStatus('Perdido');
    setLocation('');
    setDescription('');
    setPhoto('');
    setMapX(Math.floor(Math.random() * 40) + 30);
    setMapY(Math.floor(Math.random() * 40) + 30);

    // Dynamic scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide success message after 5 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  // Click on visual coordinate picker
  const handleMapSelection = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMapX(Math.round(x));
    setMapY(Math.round(y));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Graphic intro info card */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        
        {/* Success toast inside column */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-brand-primary-light border border-[#E9E1D4] text-brand-primary rounded-[24px] space-y-2 flex items-start"
          >
            <CheckCircle2 className="h-6 w-6 text-brand-primary mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold font-serif italic text-brand-primary">¡Reporte Enviado con Éxito!</h4>
              <p className="text-xs text-brand-secondary leading-relaxed mt-1">
                El reporte ha sido agregado a la base de datos de manera inmediata. Los usuarios ya pueden visualizar la información en la Galería de Reportes y el Mapa Satelital de brigadas.
              </p>
            </div>
          </motion.div>
        )}

        <div className="relative h-[250px] lg:h-[350px] rounded-[24px] overflow-hidden shadow-sm border border-[#E9E1D4] group bg-[#FDFBF7]">
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=700" 
            alt="Mascotas unidas" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent flex items-end p-6">
            <p className="text-[#FDFBF7] font-serif italic text-base leading-tight">
              "Ayúdanos a traerlos de vuelta a casa de manera segura y solidaria."
            </p>
          </div>
        </div>

        <div className="space-y-3 p-2">
          <h2 className="text-2xl font-serif text-brand-primary italic">Reportar una Mascota</h2>
          <p className="text-xs text-brand-secondary leading-relaxed">
            Completa nuestro detallado formulario con la mayor precisión posible. Cada seña particular, fotografía clara y punto geográfico aumenta exponencialmente las probabilidades de un reencuentro feliz.
          </p>
        </div>

        {/* Community standard reminder */}
        <div className="p-5 bg-brand-primary-light border border-[#E9E1D4] rounded-[24px] flex items-start text-brand-primary">
          <Info className="h-5 w-5 text-brand-primary mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Aviso Importante de Brigada:</p>
            <p className="text-brand-secondary leading-relaxed">
              Todos los datos son filtrados en tiempo real. Trata de mantener la calma y redactar descripciones precisas (presencia de collar, señas de color, si lleva o no placa o heridas visibles).
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Form Box */}
      <div className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-8 border border-[#E9E1D4] shadow-sm">
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl mb-6 text-xs text-brand-accent flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-brand-accent flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Form Title & Condition toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 pb-4 border-b border-[#E9E1D4]">
            <div>
              <h3 className="text-sm font-bold text-brand-primary">Detalles de Avistamiento</h3>
              <p className="text-[11px] text-brand-secondary">Especifica si buscas o encontraste a la mascota.</p>
            </div>

            {/* Condition badge selector */}
            <div className="flex bg-brand-primary-light border border-[#E9E1D4] p-1 rounded-xl w-full sm:w-auto">
              <button 
                type="button"
                onClick={() => setStatus('Perdido')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  status === 'Perdido'
                    ? 'bg-brand-accent text-white shadow-sm'
                    : 'text-brand-secondary hover:text-brand-primary'
                }`}
              >
                Se Perdió
              </button>
              <button 
                type="button"
                onClick={() => setStatus('Encontrado')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  status === 'Encontrado'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-brand-secondary hover:text-brand-primary'
                }`}
              >
                La Encontré / Avistada
              </button>
            </div>
          </div>

          {/* 1. Drag and Drop Image Dropzone */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block px-1">
              Fotografía de la mascota
            </label>
            
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />

            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all ${
                photo 
                  ? 'border-brand-primary bg-brand-primary-light/50' 
                  : isDragActive
                    ? 'border-brand-primary bg-brand-primary-light'
                    : 'border-[#E9E1D4] bg-[#FDFBF7] hover:bg-brand-primary-light/35'
              }`}
            >
              {photo ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-brand-primary shadow-sm">
                    <img 
                      src={photo} 
                      alt="Cargada" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-brand-primary">¡Imagen cargada correctamente!</p>
                    <p className="text-[10px] text-brand-secondary mt-0.5">Haz clic o arrastra para reemplazar la foto</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-brand-primary-light rounded-2xl text-brand-primary">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-brand-primary">Arrastra una imagen o haz clic para subir</p>
                    <p className="text-[10px] text-brand-secondary mt-1">Formatos permitidos: JPG, PNG o WEBP (Máx. 5MB)</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 2. Grid Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block px-1">
                Nombre de la Mascota
              </label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Max, Firulais (o Desconocido)"
                className="w-full h-11 px-4 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold text-[#2D2D2D]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block px-1">
                Tipo de Mascota
              </label>
              <select 
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full h-11 px-3 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-bold text-brand-secondary"
              >
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Exótico">Exótico</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block px-1">
                Tamaño Estimado
              </label>
              <select 
                value={size}
                onChange={(e: any) => setSize(e.target.value)}
                className="w-full h-11 px-3 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-bold text-brand-secondary"
              >
                <option value="Pequeño">Pequeño (Gatitos, Chihuahuas)</option>
                <option value="Mediano">Mediano (Cocker, Beagles)</option>
                <option value="Grande">Grande (Labrador, Pastores)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block px-1">
                Última Ubicación Vista
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
                  <MapPin className="h-4 w-4" />
                </div>
                <input 
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Av. Providencia 1200, Providencia, Santiago"
                  className="w-full pl-10 pr-4 h-11 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold text-[#2D2D2D]"
                />
              </div>
            </div>

          </div>

          {/* 3. Description Fields */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block px-1">
              Características & Descripción
            </label>
            <textarea 
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color del pelaje, cicatrices, si lleva puesto collar, comportamiento al llamarle o cualquier dato que distinga a la mascota del resto..."
              className="w-full p-4 bg-[#FDFBF7] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-xs font-semibold text-[#2D2D2D] resize-none"
            />
          </div>

          {/* 4. Coordinate Placement Selector (Exclusive craft feature) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block">
                Ubica el marcador satelital aproximado
              </label>
              <span className="text-[10px] text-brand-primary font-bold">
                X: {mapX}%, Y: {mapY}%
              </span>
            </div>
            <p className="text-[10px] text-brand-secondary leading-relaxed block px-1">
              Haz clic sobre la siguiente cuadrícula para definir el punto donde avistaste o perdiste a la mascota. Esto colocará un pin animado sobre el Mapa Satelital de brigadas.
            </p>

            <div 
              onClick={handleMapSelection}
              className="relative aspect-[21/9] w-full rounded-2xl bg-cover bg-center border border-[#E9E1D4] overflow-hidden cursor-crosshair group shadow-inner"
              style={{ backgroundImage: `url(${chileMap})` }}
            >
              {/* Satellite blueprint grid visual */}
              <div className="absolute inset-0 bg-brand-primary-light/10" />
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <p className="text-[9px] font-mono font-bold tracking-widest text-[#4A5D4E] select-none">
                  SATELLITE SECTOR CHILE AREA
                </p>
              </div>

              {/* Pulsing Pin Indicator */}
              <div 
                className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-brand-primary border-2 border-[#FDFBF7] shadow-md flex items-center justify-center transition-all duration-300"
                style={{ left: `${mapX}%`, top: `${mapY}%` }}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-primary/40 animate-ping" />
              </div>
            </div>
          </div>

          {/* Action button */}
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full h-11 bg-brand-primary hover:bg-brand-primary-hover text-[#FDFBF7] font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer border-0"
          >
            <Camera className="h-4 w-4" />
            <span>Publicar Reporte de Mascota</span>
          </motion.button>

        </form>
      </div>

    </div>
  );
};
