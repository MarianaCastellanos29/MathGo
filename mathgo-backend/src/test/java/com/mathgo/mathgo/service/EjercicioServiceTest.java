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
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
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
        usuario.setGrado(1);

        ejercicio = new Ejercicio();
        ejercicio.setId(1L);
        ejercicio.setGrado(1);
        ejercicio.setNivel(1);
        ejercicio.setPregunta("Cuanto es 2 + 3?");
        ejercicio.setRespuestaCorrecta("B");
        ejercicio.setExplicacion("2+3=5");
    }

    // ---------- obtenerEjercicios / obtenerEjerciciosPorNivelUsuario ----------

    @Test
    void obtenerEjercicios_debeRetornarLista() {
        when(ejercicioRepository.findAll()).thenReturn(List.of(ejercicio));
        List<Ejercicio> result = ejercicioService.obtenerEjercicios();
        assertEquals(1, result.size());
    }

    @Test
    void obtenerEjerciciosPorNivelUsuario_debeRetornarPorGradoYNivel() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(ejercicioRepository.findByGradoAndNivel(1, 1)).thenReturn(List.of(ejercicio));

        List<Ejercicio> result = ejercicioService.obtenerEjerciciosPorNivelUsuario(1L, "1");

        assertEquals(1, result.size());
    }

    // Caja blanca: rama "grado == null"
    @Test
    void obtenerEjerciciosPorNivelUsuario_sinGrado_lanza400() {
        usuario.setGrado(null);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> ejercicioService.obtenerEjerciciosPorNivelUsuario(1L, "1"));

        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void obtenerEjerciciosPorNivelUsuario_usuarioNoExiste_lanzaExcepcion() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class,
                () -> ejercicioService.obtenerEjerciciosPorNivelUsuario(99L, "1"));
    }

    // ---------- responder ----------

    @Test
    void responder_respuestaCorrecta_debeRetornarCorrecto() {
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(ejercicioRepository.findByGradoAndNivel(1, 1)).thenReturn(List.of(ejercicio));
        when(resultadoRepository.contarCorrectosPorGradoYNivel(1L, 1, 1)).thenReturn(0L);
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
        when(ejercicioRepository.findByGradoAndNivel(1, 1)).thenReturn(List.of(ejercicio));
        when(resultadoRepository.contarCorrectosPorGradoYNivel(1L, 1, 1)).thenReturn(0L);
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

    // ---------- Caja blanca: ramas de la logica de nivel, racha y XP ----------

    @Test
    void responder_completaTodosLosEjerciciosDelNivel_subeDeNivel() {
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(ejercicioRepository.findByGradoAndNivel(1, 1)).thenReturn(List.of(ejercicio));
        when(resultadoRepository.contarCorrectosPorGradoYNivel(1L, 1, 1)).thenReturn(1L);
        when(logroService.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        ejercicioService.responder(1L, 1L, "B");

        assertEquals(2, usuario.getNivelActual());
    }

    @Test
    void responder_nivelIncompleto_noSubeDeNivel() {
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(ejercicioRepository.findByGradoAndNivel(1, 1)).thenReturn(List.of(ejercicio, ejercicio));
        when(resultadoRepository.contarCorrectosPorGradoYNivel(1L, 1, 1)).thenReturn(1L);
        when(logroService.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        ejercicioService.responder(1L, 1L, "B");

        assertEquals(1, usuario.getNivelActual());
    }

    @Test
    void responder_enNivelMaximo_noSubeMas() {
        usuario.setNivelActual(3);
        ejercicio.setNivel(3);
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(ejercicioRepository.findByGradoAndNivel(1, 3)).thenReturn(List.of(ejercicio));
        when(resultadoRepository.contarCorrectosPorGradoYNivel(1L, 1, 3)).thenReturn(1L);
        when(logroService.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        ejercicioService.responder(1L, 1L, "B");

        assertEquals(3, usuario.getNivelActual());
    }

    @Test
    void responder_usuarioSinGrado_noSubeDeNivel() {
        usuario.setGrado(null);
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(logroService.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        ejercicioService.responder(1L, 1L, "B");

        assertEquals(1, usuario.getNivelActual());
    }

    @Test
    void responder_rachaDeCinco_daXpBonus() {
        usuario.setRachaActual(4);
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(ejercicioRepository.findByGradoAndNivel(1, 1)).thenReturn(List.of(ejercicio));
        when(resultadoRepository.contarCorrectosPorGradoYNivel(1L, 1, 1)).thenReturn(0L);
        when(logroService.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        ejercicioService.responder(1L, 1L, "B");

        assertEquals(5, usuario.getRachaActual());
        assertEquals(15, usuario.getXp()); // 10 base + 5 de bonus
    }

    @Test
    void responder_respuestaConEspaciosYMayusculas_seConsideraCorrecta() {
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(ejercicioRepository.findByGradoAndNivel(1, 1)).thenReturn(List.of(ejercicio));
        when(resultadoRepository.contarCorrectosPorGradoYNivel(1L, 1, 1)).thenReturn(0L);
        when(logroService.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        RespuestaResponse response = ejercicioService.responder(1L, 1L, "  b ");

        assertTrue(response.isCorrecto());
    }
}
