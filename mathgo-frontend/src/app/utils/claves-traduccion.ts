/**
 * Claves de traducción de grados y niveles (ver src/assets/i18n/es.json y en.json).
 * El catálogo niveles-grado.ts sigue siendo la fuente de los datos (ids, emojis, imágenes);
 * los textos visibles (tema, descripción, nombre del grado) se traducen con estas claves.
 *
 * Uso en una plantilla:  {{ claveNivelTema(grado, nivel.id) | translate }}
 */
export function claveNivelTema(grado: number | null | undefined, nivel: number): string {
  return `NIVELES.${grado ?? 1}.${nivel}.TEMA`;
}

export function claveNivelDescripcion(grado: number | null | undefined, nivel: number): string {
  return `NIVELES.${grado ?? 1}.${nivel}.DESCRIPCION`;
}

/** "Primer grado" / "First grade" (0 = sin grado elegido: "Tu grado" / "Your grade"). */
export function claveGradoNombre(grado: number | null | undefined): string {
  return `GRADO.NOMBRE.${grado ?? 0}`;
}

/** Igual que el nombre pero en minúsculas, para usarlo dentro de una frase. */
export function claveGradoEnFrase(grado: number | null | undefined): string {
  return `GRADO.EN_FRASE.${grado ?? 0}`;
}
