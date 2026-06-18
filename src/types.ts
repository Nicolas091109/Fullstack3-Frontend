export interface Report {
  id: string;
  name: string;
  type: 'Perro' | 'Gato' | 'Exótico' | 'Otro';
  size: 'Pequeño' | 'Mediano' | 'Grande';
  description: string;
  location: string;
  date: string;
  photo: string;
  status: 'Perdido' | 'Encontrado';
  reporter: string;
  reporterEmail: string;
  // Coordinates for our cool interactive satellite map view (lat, lng as offsets in a nice grid)
  mapX: number; // 0 to 100 percentage
  mapY: number; // 0 to 100 percentage
  comments?: Comment[];
}

export interface Comment {
  id: string;
  texto: string;
  foto?: string;
  usuarioId: number;
  usuarioNombre: string;
  fechaRegistro: string;
}

export interface Message {
  id?: string;
  emisorId: number;
  emisorNombre: string;
  receptorId: number;
  receptorNombre: string;
  texto: string;
  fechaRegistro: string;
}

export interface User {
  id?: number;
  email: string;
  role: 'admin' | 'user';
  name: string;
  token?: string;
}

