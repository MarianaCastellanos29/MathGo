package com.mathgo.mathgo.service;

import com.mathgo.mathgo.model.Ejercicio;
import com.mathgo.mathgo.model.EjercicioTraduccion;
import com.mathgo.mathgo.repository.EjercicioTraduccionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class TraduccionEjercicioServiceTest {

    @Mock private EjercicioTraduccionRepository repositorio;

    private TraduccionEjercicioService servicio;
    private Ejercicio uno;
    private Ejercicio dos;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        servicio = new TraduccionEjercicioService(repositorio);

        uno = ejercicio(1L, "¿Cuánto es 3 + 2?", "4", "5", "6", "B", "3 + 2 = 5");
        dos = ejercicio(2L, "¿Cuánto es 5 - 2?", "2", "3", "4", "B", "5 - 2 = 3");
    }

    private Ejercicio ejercicio(Long id, String pregunta, String a, String b, String c, String correcta, String explicacion) {
        Ejercicio e = new Ejercicio();
        e.setId(id);
        e.setPregunta(pregunta);
        e.setOpcionA(a);
        e.setOpcionB(b);
        e.setOpcionC(c);
        e.setRespuestaCorrecta(correcta);
        e.setExplicacion(explicacion);
        e.setNivel(1);
        e.setGrado(1);
        return e;
    }

    private EjercicioTraduccion traduccion(Long ejercicioId, String pregunta, String explicacion) {
        EjercicioTraduccion t = new EjercicioTraduccion();
        t.setEjercicioId(ejercicioId);
        t.setIdioma("en");
        t.setPregunta(pregunta);
        t.setOpcionA("4");
        t.setOpcionB("5");
        t.setOpcionC("6");
        t.setExplicacion(explicacion);
        return t;
    }

    @Test
    void localizar_enEspanol_devuelveLosMismosEjerciciosSinConsultar() {
        List<Ejercicio> lista = List.of(uno, dos);

        assertSame(lista, servicio.localizar(lista, "es"));
        verifyNoInteractions(repositorio);
    }

    @Test
    void localizar_enIngles_reemplazaLosTextosYConservaLoDemas() {
        when(repositorio.findByEjercicioIdInAndIdioma(any(), anyString()))
                .thenReturn(List.of(traduccion(1L, "What is 3 + 2?", "3 + 2 = 5")));

        List<Ejercicio> resultado = servicio.localizar(List.of(uno), "en");

        Ejercicio e = resultado.get(0);
        assertEquals("What is 3 + 2?", e.getPregunta());
        assertEquals(1L, e.getId());
        assertEquals("B", e.getRespuestaCorrecta());
        assertEquals(1, e.getNivel());
        assertEquals(1, e.getGrado());
    }

    @Test
    void localizar_noModificaLaEntidadOriginal() {
        when(repositorio.findByEjercicioIdInAndIdioma(any(), anyString()))
                .thenReturn(List.of(traduccion(1L, "What is 3 + 2?", "3 + 2 = 5")));

        servicio.localizar(List.of(uno), "en");

        assertEquals("¿Cuánto es 3 + 2?", uno.getPregunta());
    }

    @Test
    void localizar_ejercicioSinTraduccion_seDevuelveEnEspanol() {
        when(repositorio.findByEjercicioIdInAndIdioma(any(), anyString()))
                .thenReturn(List.of(traduccion(1L, "What is 3 + 2?", "3 + 2 = 5")));

        List<Ejercicio> resultado = servicio.localizar(List.of(uno, dos), "en");

        assertEquals("What is 3 + 2?", resultado.get(0).getPregunta());
        assertSame(dos, resultado.get(1));
    }

    @Test
    void localizar_sinNingunaTraduccion_devuelveLaListaOriginal() {
        when(repositorio.findByEjercicioIdInAndIdioma(any(), anyString())).thenReturn(List.of());
        List<Ejercicio> lista = List.of(uno, dos);

        assertSame(lista, servicio.localizar(lista, "fr"));
    }

    @Test
    void localizar_campoDeTraduccionVacio_usaElOriginal() {
        EjercicioTraduccion t = traduccion(1L, "What is 3 + 2?", "");
        when(repositorio.findByEjercicioIdInAndIdioma(any(), anyString())).thenReturn(List.of(t));

        Ejercicio e = servicio.localizar(List.of(uno), "en").get(0);

        assertEquals("3 + 2 = 5", e.getExplicacion());
    }

    @Test
    void localizar_listaNulaOVacia_seDevuelveTalCual() {
        assertNull(servicio.localizar(null, "en"));
        List<Ejercicio> vacia = List.of();
        assertSame(vacia, servicio.localizar(vacia, "en"));
    }
}
