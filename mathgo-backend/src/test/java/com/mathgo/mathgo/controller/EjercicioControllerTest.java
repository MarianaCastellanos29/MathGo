package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.dto.RespuestaRequest;
import com.mathgo.mathgo.dto.RespuestaResponse;
import com.mathgo.mathgo.model.Ejercicio;
import com.mathgo.mathgo.service.EjercicioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EjercicioControllerTest {

    @Mock private EjercicioService ejercicioService;
    @InjectMocks private EjercicioController ejercicioController;

    private Ejercicio ejercicio;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ejercicio = new Ejercicio();
        ejercicio.setId(1L);
        ejercicio.setNivel(1);
        ejercicio.setPregunta("¿Cuanto es 2 + 3?");
        ejercicio.setRespuestaCorrecta("B");
    }

    @Test
    void listar_debeRetornarLista() {
        when(ejercicioService.obtenerEjercicios()).thenReturn(List.of(ejercicio));
        List<Ejercicio> result = ejercicioController.listar();
        assertEquals(1, result.size());
    }

    @Test
    void porNivel_debeRetornarEjercicios() {
        when(ejercicioService.obtenerEjerciciosPorNivelUsuario(1L, "1")).thenReturn(List.of(ejercicio));
        List<Ejercicio> result = ejercicioController.porNivel(1L, "1");
        assertEquals(1, result.size());
    }

    @Test
    void responder_correcto_debeRetornarRespuesta() {
        RespuestaResponse respuesta = new RespuestaResponse(true, "Correcto!", 5);
        when(ejercicioService.responder(1L, 1L, "B")).thenReturn(respuesta);

        RespuestaRequest request = new RespuestaRequest();
        request.setUsuarioId(1L);
        request.setEjercicioId(1L);
        request.setRespuesta("B");

        RespuestaResponse result = ejercicioController.responder(request);
        assertTrue(result.isCorrecto());
    }

    @Test
    void responder_incorrecto_debeRetornarFalse() {
        RespuestaResponse respuesta = new RespuestaResponse(false, "Incorrecto", 4);
        when(ejercicioService.responder(1L, 1L, "A")).thenReturn(respuesta);

        RespuestaRequest request = new RespuestaRequest();
        request.setUsuarioId(1L);
        request.setEjercicioId(1L);
        request.setRespuesta("A");

        RespuestaResponse result = ejercicioController.responder(request);
        assertFalse(result.isCorrecto());
    }
}