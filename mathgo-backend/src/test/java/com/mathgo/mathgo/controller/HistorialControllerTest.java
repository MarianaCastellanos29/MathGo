package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.model.Resultado;
import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.model.UsuarioLogro;
import com.mathgo.mathgo.repository.ResultadoRepository;
import com.mathgo.mathgo.repository.UsuarioRepository;
import com.mathgo.mathgo.service.LogroService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HistorialControllerTest {

    @Mock private ResultadoRepository resultadoRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private LogroService logroService;

    @InjectMocks
    private HistorialController historialController;

    private Usuario alumno;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        alumno = new Usuario();
        alumno.setId(1L);
        alumno.setNombre("lilo");
        alumno.setVidas(5);
        alumno.setXp(0);
        alumno.setRachaActual(0);
        alumno.setMejorRacha(0);
        alumno.setNivelActual(1);
    }

    @Test
    void obtenerHistorial_debeRetornarLista() {
        when(resultadoRepository.findByUsuarioIdOrderByFechaRespuestaDesc(1L))
            .thenReturn(List.of(new Resultado()));
        List<Resultado> resultado = historialController.obtenerHistorial(1L);
        assertEquals(1, resultado.size());
    }

    @Test
    void obtenerLogros_debeRetornarLista() {
        when(logroService.obtenerLogrosDeUsuario(1L)).thenReturn(List.of(new UsuarioLogro()));
        List<UsuarioLogro> logros = historialController.obtenerLogros(1L);
        assertEquals(1, logros.size());
    }

    @Test
    void guardarResultado_correcto_debeRetornar200() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(usuarioRepository.save(any())).thenReturn(alumno);
        when(logroService.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        Map<String, Object> body = Map.of(
            "usuarioId", "1",
            "pregunta", "¿Cuánto es 2+2?",
            "nivel", "1",
            "correcto", "true"
        );

        ResponseEntity<?> response = historialController.guardarResultado(body);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void guardarResultado_incorrecto_debeResetearRacha() {
        alumno.setRachaActual(5);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(usuarioRepository.save(any())).thenReturn(alumno);
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        Map<String, Object> body = Map.of(
            "usuarioId", "1",
            "pregunta", "¿Cuánto es 2+2?",
            "nivel", "1",
            "correcto", "false"
        );

        historialController.guardarResultado(body);
        assertEquals(0, alumno.getRachaActual());
    }

    @Test
    void guardarResultado_usuarioNoExistente_debeRetornar400() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        Map<String, Object> body = Map.of(
            "usuarioId", "99",
            "pregunta", "¿Cuánto es 2+2?",
            "nivel", "1",
            "correcto", "true"
        );

        ResponseEntity<?> response = historialController.guardarResultado(body);
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void guardarResultado_correcto_debeActualizarMejorRacha() {
        alumno.setRachaActual(5);
        alumno.setMejorRacha(5);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(usuarioRepository.save(any())).thenReturn(alumno);
        when(logroService.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroService.verificarLogros(any())).thenReturn(List.of());

        Map<String, Object> body = Map.of(
            "usuarioId", "1",
            "pregunta", "¿Cuánto es 2+2?",
            "nivel", "1",
            "correcto", "true"
        );

        historialController.guardarResultado(body);
        assertEquals(6, alumno.getMejorRacha());
    }
}