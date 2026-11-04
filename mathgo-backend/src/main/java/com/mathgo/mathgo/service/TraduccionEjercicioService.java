package com.mathgo.mathgo.service;

import com.mathgo.mathgo.model.Ejercicio;
import com.mathgo.mathgo.model.EjercicioTraduccion;
import com.mathgo.mathgo.repository.EjercicioTraduccionRepository;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Devuelve los ejercicios en el idioma de la petición (cabecera Accept-Language).
 * El español es el idioma original; si no hay traducción, se devuelve el ejercicio tal cual.
 */
@Service
public class TraduccionEjercicioService {

    private final EjercicioTraduccionRepository traduccionRepository;

    public TraduccionEjercicioService(EjercicioTraduccionRepository traduccionRepository) {
        this.traduccionRepository = traduccionRepository;
    }

    /** Traduce al idioma de la petición actual. */
    public List<Ejercicio> localizar(List<Ejercicio> ejercicios) {
        return localizar(ejercicios, LocaleContextHolder.getLocale().getLanguage());
    }

    public List<Ejercicio> localizar(List<Ejercicio> ejercicios, String idioma) {
        if (ejercicios == null || ejercicios.isEmpty()
                || idioma == null || idioma.isBlank() || "es".equalsIgnoreCase(idioma)) {
            return ejercicios;
        }

        List<Long> ids = ejercicios.stream().map(Ejercicio::getId).toList();
        Map<Long, EjercicioTraduccion> porEjercicio = traduccionRepository
                .findByEjercicioIdInAndIdioma(ids, idioma.toLowerCase())
                .stream()
                .collect(Collectors.toMap(EjercicioTraduccion::getEjercicioId, t -> t, (a, b) -> a));

        if (porEjercicio.isEmpty()) {
            return ejercicios;
        }
        return ejercicios.stream().map(e -> traducir(e, porEjercicio.get(e.getId()))).toList();
    }

    /** Crea una copia (no se modifica la entidad guardada) con los textos traducidos. */
    private Ejercicio traducir(Ejercicio original, EjercicioTraduccion t) {
        if (t == null) {
            return original;
        }
        Ejercicio copia = new Ejercicio();
        copia.setId(original.getId());
        copia.setNivel(original.getNivel());
        copia.setGrado(original.getGrado());
        copia.setRespuestaCorrecta(original.getRespuestaCorrecta());
        copia.setPregunta(valor(t.getPregunta(), original.getPregunta()));
        copia.setOpcionA(valor(t.getOpcionA(), original.getOpcionA()));
        copia.setOpcionB(valor(t.getOpcionB(), original.getOpcionB()));
        copia.setOpcionC(valor(t.getOpcionC(), original.getOpcionC()));
        copia.setExplicacion(valor(t.getExplicacion(), original.getExplicacion()));
        return copia;
    }

    private static String valor(String traducido, String original) {
        return (traducido == null || traducido.isBlank()) ? original : traducido;
    }
}
