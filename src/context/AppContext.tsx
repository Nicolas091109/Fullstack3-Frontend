import React, { createContext, useContext, useState, useEffect } from 'react';
import { Report, User } from '../types';
import { INITIAL_REPORTS } from '../data';

interface AppContextType {
  user: User | null;
  reports: Report[];
  usersList: any[];
  geoList: any[];
  login: (email: string, password: string) => Promise<{ success: boolean; role: 'admin' | 'user' }>;
  register: (email: string, password: string, nombre: string) => Promise<{ success: boolean }>;
  logout: () => void;
  addReport: (newReport: Omit<Report, 'id' | 'date' | 'reporter' | 'reporterEmail'>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  updateReport: (updatedReport: Report) => Promise<void>;
  addComment: (reportId: string, texto: string, foto?: string) => Promise<void>;
  sendChatMessage: (receptorId: number, receptorNombre: string, texto: string) => Promise<void>;
  fetchUserMessages: () => Promise<any[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || '';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('sanos_y_salvos_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [geoList, setGeoList] = useState<any[]>([]);

  // Helper to construct authorization headers
  const getAuthHeaders = (extraHeaders: Record<string, string> = {}) => {
    const savedUserStr = localStorage.getItem('sanos_y_salvos_user');
    const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
    const token = user?.token || savedUser?.token;

    const headers: Record<string, string> = { ...extraHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Helper to fetch all data from backend
  const fetchReports = async () => {
    try {
      const headers = getAuthHeaders();

      // 1. Fetch reports
      const resReports = await fetch(`${API_BASE}/api/reportes`, { headers });
      if (!resReports.ok) throw new Error('Error al obtener reportes');
      const dataReports = await resReports.json();

      // 2. Fetch locations to map sector names
      const resLocations = await fetch(`${API_BASE}/api/geo/historial`, { headers });
      const locationsMap: Record<number, string> = {};
      if (resLocations.ok) {
        const dataLocations = await resLocations.json();
        setGeoList(dataLocations);
        dataLocations.forEach((loc: any) => {
          locationsMap[loc.id] = loc.nombreSector;
        });
      }

      // 3. Fetch users to map reporter names and emails
      const resUsers = await fetch(`${API_BASE}/api/auth/usuarios`, { headers });
      const usersMap: Record<number, { nombre: string; email: string }> = {};
      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        setUsersList(dataUsers);
        dataUsers.forEach((u: any) => {
          usersMap[u.id] = { nombre: u.nombre, email: u.email };
        });
      }

      // 4. Map backend representations to FrontEnd format
      const mappedReports: Report[] = dataReports.map((r: any) => {
        const locName = r.ubicacionId ? (locationsMap[r.ubicacionId] || `Sector #${r.ubicacionId}`) : 'Ubicación Desconocida';
        const userDetails = r.usuarioId ? (usersMap[r.usuarioId] || { nombre: 'Vecino Anónimo', email: 'anonimo@sanosysalvos.cl' }) : { nombre: 'Vecino Anónimo', email: 'anonimo@sanosysalvos.cl' };

        return {
          id: r.id,
          name: r.nombreMascota || 'Mascota Desconocida',
          type: (r.tipoAnimal || 'Otro') as any,
          size: (r.tamano || 'Mediano') as any,
          description: r.descripcion || '',
          location: locName,
          date: r.fechaRegistro ? new Date(r.fechaRegistro).toLocaleString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }) : 'Fecha no registrada',
          photo: r.foto || '',
          status: (r.estado === 'ACTIVO' ? 'Perdido' : 'Encontrado') as any,
          reporter: userDetails.nombre,
          reporterEmail: userDetails.email,
          mapX: r.mapX ?? 50,
          mapY: r.mapY ?? 50,
          comments: r.comentarios || [],
          // hidden metadata for edits
          originalUbicacionId: r.ubicacionId,
          originalUsuarioId: r.usuarioId
        } as any;
      });

      // Sort by date/id desc if needed (or keep Mongo natural order). Here we reverse to show newest first.
      setReports(mappedReports);
    } catch (error) {
      console.error('Error fetching reports from backend:', error);
      // Fallback to initial local reports if backend fails/is not loaded yet
      setReports(INITIAL_REPORTS);
    }
  };

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      const role: 'admin' | 'user' = data.usuario.rol.toUpperCase() === 'ADMIN' ? 'admin' : 'user';
      
      const loggedUser: User = {
        id: data.usuario.id,
        email: data.usuario.email,
        role,
        name: data.usuario.nombre,
        token: data.token,
      };

      setUser(loggedUser);
      localStorage.setItem('sanos_y_salvos_user', JSON.stringify(loggedUser));
      return { success: true, role };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, role: 'user' as const };
    }
  };

  const register = async (email: string, password: string, nombre: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nombre
        })
      });

      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sanos_y_salvos_user');
  };

  const addReport = async (newReport: Omit<Report, 'id' | 'date' | 'reporter' | 'reporterEmail'>) => {
    try {
      // 1. Save location in ms-geolocation
      const locResponse = await fetch(`${API_BASE}/api/geo/ubicar`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          latitud: newReport.mapY,
          longitud: newReport.mapX,
          nombreSector: newReport.location
        })
      });

      if (!locResponse.ok) throw new Error('Error al registrar ubicación');
      const savedLoc = await locResponse.json();

      // 2. Save report in ms-reporting
      const userId = user ? user.id : null;
      const reportResponse = await fetch(`${API_BASE}/api/reportes`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          tipoAnimal: newReport.type,
          descripcion: newReport.description,
          ubicacionId: savedLoc.id,
          usuarioId: userId,
          estado: newReport.status === 'Perdido' ? 'ACTIVO' : 'RESUELTO',
          nombreMascota: newReport.name,
          tamano: newReport.size,
          foto: newReport.photo,
          mapX: newReport.mapX,
          mapY: newReport.mapY,
          fechaRegistro: new Date().toISOString()
        })
      });

      if (!reportResponse.ok) throw new Error('Error al registrar reporte');
      await fetchReports();
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/reportes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al eliminar el reporte');
      await fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  };

  const updateReport = async (updatedReport: Report) => {
    try {
      const originalUbicacionId = (updatedReport as any).originalUbicacionId;
      const originalUsuarioId = (updatedReport as any).originalUsuarioId;

      const response = await fetch(`${API_BASE}/api/reportes/${updatedReport.id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          id: updatedReport.id,
          tipoAnimal: updatedReport.type,
          descripcion: updatedReport.description,
          ubicacionId: originalUbicacionId,
          usuarioId: originalUsuarioId,
          estado: updatedReport.status === 'Perdido' ? 'ACTIVO' : 'RESUELTO',
          nombreMascota: updatedReport.name,
          tamano: updatedReport.size,
          foto: updatedReport.photo,
          mapX: updatedReport.mapX,
          mapY: updatedReport.mapY,
          fechaRegistro: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Error al actualizar el reporte');
      await fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  };

  const addComment = async (reportId: string, texto: string, foto?: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/reportes/${reportId}/comentarios`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          texto,
          foto,
          usuarioId: user ? user.id : 0,
          usuarioNombre: user ? user.name : 'Vecino Anónimo'
        })
      });
      if (!response.ok) throw new Error('Error al guardar comentario');
      await fetchReports();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const sendChatMessage = async (receptorId: number, receptorNombre: string, texto: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/reportes/chat/enviar`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          emisorId: user ? user.id : 0,
          emisorNombre: user ? user.name : 'Vecino Anónimo',
          receptorId,
          receptorNombre,
          texto
        })
      });
      if (!response.ok) throw new Error('Error al enviar mensaje');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const fetchUserMessages = async () => {
    try {
      if (!user || !user.id) return [];
      const response = await fetch(`${API_BASE}/api/reportes/chat/usuario/${user.id}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener mensajes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  return (
    <AppContext.Provider value={{
      user, reports, usersList, geoList, login, register, logout, addReport, deleteReport, updateReport,
      addComment, sendChatMessage, fetchUserMessages
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
