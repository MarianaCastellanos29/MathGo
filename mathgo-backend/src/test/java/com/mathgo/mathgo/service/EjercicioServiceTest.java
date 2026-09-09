package com.mathgo.mathgo.service;

import com.mathgo.mathgo.dto.RespuestaResponse;
import com.mathgo.mathgo.model.Ejercicio;
import com.mathgo.mathgo.model.Resultado;
import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.EjercicioRepository;
import com.mathgo.mathgo.repository.ResultadoRepository;
import com.mathgo.mathgo.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EjercicioServiceTest {

    @Mock private EjercicioRepository ejercicioRepository;
    @Mock private ResultadoRepository resultadoRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private LogroService logroService;

    @InjectMocks private EjercicioService ejercicioService;

    private Usuario usuario;
    private Ejercicio ejercicio;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test");
        usuario.setVidas(5);
        usuario.setNivelActual(1);
        usuario.setRachaActual(0);
        usuario.setMejorRacha(0);
        usuario.setXp(0);
        usuario.setRango("Aprendiz");

        ejercicio = new Ejercicio();
        ejercicio.setId(1L);
        ejercicio.setNivel(1);
        ejercicio.setPregunta("¿Cuanto es 2 + 3?");
        ejercicio.setRespuestaCorrecta("B");
        ejercicio.setExplicacion("2+3=5");
    }

    @Test
    void obtenerEjercicios_debeRetornarLista() {
        when(ejercicioRepository.findAll()).thenReturn(List.of(ejercicio));
        List<Ejercicio> result = ejercicioService.obtenerEjercicios();
        assertEquals(1, result.size());
    }

    @Test
    void obtenerEjerciciosPorNivelUsuario_debeRetornarPorNivel() {
        when(ejercicioRepository.findByNivel(1)).thenReturn(List.of(ejercicio));
        List<Ejercicio> result = ejercicioService.obtenerEjerciciosPorNivelUsuario(1L, "1");
        assertEquals(1, result.size());
    }

    @Test
    void responder_respuestaCorrecta_debeRetornarCorrecto() {
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(ejercicioRepository.findByNivel(1)).thenReturn(List.of(ejercicio));
        when(resultadoRepository.contarCorrectosPorNivel(1L, 1)).thenReturn(1L);
        when(logroService.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        RespuestaResponse response = ejercicioService.responder(1L, 1L, "B");

        assertTrue(response.isCorrecto());
    }

    @Test
    void responder_respuestaIncorrecta_debeDescontarVida() {
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        ejercicioService.responder(1L, 1L, "A");

        assertEquals(4, usuario.getVidas());
    }

    @Test
    void responder_vidasNoNegativas_cuandoEsCero() {
        usuario.setVidas(0);
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        ejercicioService.responder(1L, 1L, "A");

        assertEquals(0, usuario.getVidas());
    }

    @Test
    void responder_rachaAumentaConRespuestaCorrecta() {
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(ejercicioRepository.findByNivel(1)).thenReturn(List.of(ejercicio));
        when(resultadoRepository.contarCorrectosPorNivel(1L, 1)).thenReturn(0L);
        when(logroService.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        ejercicioService.responder(1L, 1L, "B");

        assertEquals(1, usuario.getRachaActual());
    }

    @Test
    void responder_rachaSeReiniciaCuandoIncorrecto() {
        usuario.setRachaActual(5);
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        ejercicioService.responder(1L, 1L, "A");

        assertEquals(0, usuario.getRachaActual());
    }

    @Test
    void responder_ejercicioNoEncontrado_lanzaExcepcion() {
        when(ejercicioRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> ejercicioService.responder(1L, 99L, "A"));
    }

    @Test
    void responder_usuarioNoEncontrado_lanzaExcepcion() {
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> ejercicioService.responder(99L, 1L, "A"));
    }
}