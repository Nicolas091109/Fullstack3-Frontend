import { Report } from './types';
 
export const INITIAL_REPORTS: Report[] = [
  {
    id: "SS-4921",
    name: "Max",
    type: "Perro",
    size: "Mediano",
    description: "Golden Retriever joven de pelo dorado muy brillante. Traía puesto un collar azul sin placa. Es extremadamente dócil, juguetón y responde con facilidad cuando se le llama por su nombre. Se asusta un poco con ruidos fuertes de automóviles.",
    location: "Providencia, Santiago",
    date: "2026-06-15, 13:30",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
    status: "Perdido",
    reporter: "Ricardo Mendoza",
    reporterEmail: "ricardo@test.com",
    mapX: 28,
    mapY: 38
  },
  {
    id: "SS-4918",
    name: "Luna",
    type: "Gato",
    size: "Pequeño",
    description: "Gata muy tranquila, de color negro con pecho y patitas blancas estilo 'tuxedo'. Tiene ojos verdes intensos. Fue rescatada temporalmente cerca de la Alameda. Es desconfiada pero si se le ofrece comida húmeda se acerca amigablemente.",
    location: "Av. Libertador Bernardo O'Higgins, Santiago",
    date: "2026-06-15, 10:15",
    photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
    status: "Encontrado",
    reporter: "Laura García",
    reporterEmail: "laura@test.com",
    mapX: 62,
    mapY: 22
  },
  {
    id: "SS-4899",
    name: "Bruno",
    type: "Perro",
    size: "Pequeño",
    description: "Beagle orejón tricolor (marrón, blanco y negro). Lleva collar de cuero marrón. Estaba corriendo desorientado por las calles residenciales. Es muy enérgico y ladra de felicidad al ver comida.",
    location: "Las Condes, Santiago",
    date: "2026-06-14, 18:30",
    photo: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=600",
    status: "Perdido",
    reporter: "Ana Silva",
    reporterEmail: "ana@test.com",
    mapX: 47,
    mapY: 58
  },
  {
    id: "SS-4872",
    name: "Desconocido",
    type: "Gato",
    size: "Pequeño",
    description: "Gatito atigrado de color naranja brillante con rayas grises. Se refugió bajo una banca del Parque Forestal. Se nota que tiene dueño porque está gordo y limpio, pero no tiene placa de identificación.",
    location: "Parque Forestal, Santiago",
    date: "2026-06-15, 09:15",
    photo: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600",
    status: "Encontrado",
    reporter: "Carlos Ortiz",
    reporterEmail: "carlos@test.com",
    mapX: 53,
    mapY: 46
  },
  {
    id: "SS-4855",
    name: "Toby",
    type: "Pequeño",
    size: "Pequeño",
    description: "Perro Westie (West Highland White Terrier) de color completamente blanco. Muy alegre e hiperactivo. Responde al silbido. Se extravió durante su paseo matutino cerca del cruce de calles.",
    location: "Ñuñoa, Santiago",
    date: "2026-06-14, 08:30",
    photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
    status: "Perdido",
    reporter: "Alejandra Ruiz",
    reporterEmail: "alejandra@test.com",
    mapX: 38,
    mapY: 28
  }
] as any[]; // Type assertion if some fields vary slightly
