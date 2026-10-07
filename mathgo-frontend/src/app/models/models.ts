export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password: string;
  rol?: string;
  vidas?: number;
  nivelActual?: number;
  rachaActual?: number;
  mejorRacha?: number;
  xp?: number;
  rango?: string;
}

export interface LoginResponse {
  token: string;
  usuarioId: number;
  nombre: string;
  rol: string;
  vidas: number;
  nivelActual: number;
  rachaActual?: number;
  xp?: number;
  rango?: string;
  avatar?: string;
  itemsComprados?: string;
}

export interface Ejercicio {
  id: number;
  pregunta: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  nivel: number;
}

export interface RespuestaRequest {
  usuarioId: number;
  ejercicioId: number;
  respuesta: string;
}

export interface RespuestaResponse {
  correcto: boolean;
  mensaje: string;
  vidas: number;
}

export interface ProgresoResponse {
  total: number;
  correctos: number;
  porcentaje: number;
}

export interface Logro {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  tipo: string;
  valorRequerido: number;
}

export interface UsuarioLogro {
  id: number;
  logro: Logro;
  fechaObtenido: string;
}

export interface HistorialItem {
  id: number;
  pregunta: string;
  nivel: number;
  correcto: boolean;
  fechaRespuesta: string;
}