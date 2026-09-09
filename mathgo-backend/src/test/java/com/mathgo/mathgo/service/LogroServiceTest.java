package com.mathgo.mathgo.service;

import com.mathgo.mathgo.model.*;
import com.mathgo.mathgo.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LogroServiceTest {

    @Mock private LogroRepository logroRepository;
    @Mock private UsuarioLogroRepository usuarioLogroRepository;
    @Mock private ResultadoRepository resultadoRepository;

    @InjectMocks
    private LogroService logroService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setXp(0);
        usuario.setRachaActual(0);
        usuario.setMejorRacha(0);
        usuario.setNivelActual(1);
    }

    @Test
    void calcularRango_conXpBajo_debeRetornarAprendiz() {
        assertEquals("Aprendiz", logroService.calcularRango(0));
        assertEquals("Aprendiz", logroService.calcularRango(79));
    }

    @Test
    void calcularRango_conXpMedio_debeRetornarEstudiante() {
        assertEquals("Estudiante", logroService.calcularRango(80));
        assertEquals("Estudiante", logroService.calcularRango(199));
    }

    @Test
    void calcularRango_conXpAlto_debeRetornarMatematico() {
        assertEquals("Matematico", logroService.calcularRango(200));
        assertEquals("Matematico", logroService.calcularRango(499));
    }

    @Test
    void calcularRango_conXpMuyAlto_debeRetornarGenio() {
        assertEquals("Genio", logroService.calcularRango(500));
        assertEquals("Genio", logroService.calcularRango(1000));
    }

    @Test
    void obtenerLogrosDeUsuario_debeRetornarLista() {
        when(usuarioLogroRepository.findByUsuarioId(1L)).thenReturn(List.of(new UsuarioLogro()));
        List<UsuarioLogro> logros = logroService.obtenerLogrosDeUsuario(1L);
        assertEquals(1, logros.size());
    }

    @Test
    void verificarLogros_debeOtorgarLogroNuevo() {
        Logro logro = new Logro();
        logro.setId(1L);
        logro.setTipo("XP");
        logro.setValorRequerido(0);

        when(resultadoRepository.findByUsuarioIdAndCorrectoTrue(1L)).thenReturn(List.of());
        when(logroRepository.findByTipoAndValorRequeridoLessThanEqual(anyString(), anyInt()))
            .thenReturn(List.of(logro));
        when(usuarioLogroRepository.existsByUsuarioIdAndLogroId(anyLong(), anyLong()))
            .thenReturn(false);
        when(usuarioLogroRepository.findByUsuarioId(1L)).thenReturn(List.of(new UsuarioLogro()));

        List<UsuarioLogro> resultado = logroService.verificarLogros(usuario);
        assertEquals(1, resultado.size());
        verify(usuarioLogroRepository, atLeastOnce()).save(any());
    }

    @Test
    void verificarLogros_noDebeOtorgarLogroYaObtenido() {
        Logro logro = new Logro();
        logro.setId(1L);

        when(resultadoRepository.findByUsuarioIdAndCorrectoTrue(1L)).thenReturn(List.of());
        when(logroRepository.findByTipoAndValorRequeridoLessThanEqual(anyString(), anyInt()))
            .thenReturn(List.of(logro));
        when(usuarioLogroRepository.existsByUsuarioIdAndLogroId(anyLong(), anyLong()))
            .thenReturn(true);
        when(usuarioLogroRepository.findByUsuarioId(1L)).thenReturn(List.of());

        logroService.verificarLogros(usuario);
        verify(usuarioLogroRepository, never()).save(any());
    }
}