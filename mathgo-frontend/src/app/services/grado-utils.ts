/**
 * Utilidades para leer la sesión del niño sin depender de cómo la guarde tu login.
 * Busca el id, el rol y el token JWT en localStorage / sessionStorage.
 */
export interface SesionUsuario {
  id: number | null;
  rol: string | null;
}

const REGEX_JWT = /^[\w-]+\.[\w-]+\.[\w-]+$/;
const REGEX_CLAVE_ID = /^(id|id[_-]?(usuario|user|alumno)|(usuario|user|alumno)[_-]?id)$/i;

function almacenes(): Storage[] {
  return [localStorage, sessionStorage];
}

export function obtenerToken(): string | null {
  for (const store of almacenes()) {
    for (let i = 0; i < store.length; i++) {
      const clave = store.key(i);
      if (!clave) continue;
      let valor = store.getItem(clave);
      if (!valor) continue;
      valor = valor.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
      if (REGEX_JWT.test(valor)) return valor;
    }
  }
  return null;
}

function decodificarJwt(token: string): any {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function obtenerSesion(): SesionUsuario {
  let id: number | null = null;
  let rol: string | null = null;

  for (const store of almacenes()) {
    for (let i = 0; i < store.length; i++) {
      const clave = store.key(i);
      if (!clave || /^grado/i.test(clave)) continue;
      const valor = store.getItem(clave);
      if (!valor) continue;

      if (REGEX_CLAVE_ID.test(clave) && /^\d+$/.test(valor)) {
        id = id ?? Number(valor);
        continue;
      }
      if (/^(rol|role)$/i.test(clave)) {
        rol = rol ?? valor.replace(/^"|"$/g, '');
        continue;
      }
      if (valor.startsWith('{')) {
        try {
          const o = JSON.parse(valor);
          const oid = o.id ?? o.usuarioId ?? o.userId;
          if (typeof oid === 'number' && (o.correo || o.rol || o.nombre)) {
            id = id ?? oid;
            if (o.rol) rol = rol ?? String(o.rol);
          }
        } catch { /* ignorar */ }
      }
    }
  }

  if (id === null || rol === null) {
    const token = obtenerToken();
    const payload = token ? decodificarJwt(token) : null;
    if (payload) {
      const candidato = payload.id ?? payload.usuarioId ?? payload.userId ?? payload.uid;
      if (id === null && typeof candidato === 'number') id = candidato;
      const rolJwt = payload.rol ?? payload.role;
      if (rol === null && rolJwt) rol = String(rolJwt);
    }
  }
  return { id, rol };
}

export function esAlumno(rol: string | null | undefined): boolean {
  if (!rol) return true; // si no sabemos el rol, el backend lo confirma
  return rol.toUpperCase().replace('ROLE_', '') === 'ALUMNO';
}
