package com.mathgo.mathgo.service;

import com.mathgo.mathgo.dto.ProgresoResponse;
import com.mathgo.mathgo.model.Resultado;
import com.mathgo.mathgo.repository.ResultadoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProgresoServiceTest {

    @Mock
    private ResultadoRepository resultadoRepository;

    @InjectMocks
    private ProgresoService progresoService;

    private Resultado correcto;
    private Resultado incorrecto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        correcto = new Resultado();
        correcto.setCorrecto(true);
        correcto.setFechaRespuesta(LocalDateTime.now());

        incorrecto = new Resultado();
        incorrecto.setCorrecto(false);
        incorrecto.setFechaRespuesta(LocalDateTime.now());
    }

    @Test
    void obtenerProgreso_debeCalcularPorcentajeCorrectamente() {
        when(resultadoRepository.findByUsuarioId(1L))
                .thenReturn(List.of(correcto, correcto, correcto, incorrecto));
        when(resultadoRepository.countByUsuarioIdAndCorrectoTrue(1L)).thenReturn(3L);

        ProgresoResponse response = progresoService.obtenerProgreso(1L);

        assertEquals(75.0, response.getPorcentaje());
    }

    @Test
    void obtenerProgreso_sinResultados_debeRetornarCero() {
        when(resultadoRepository.findByUsuarioId(1L)).thenReturn(List.of());
        when(resultadoRepository.countByUsuarioIdAndCorrectoTrue(1L)).thenReturn(0L);

        ProgresoResponse response = progresoService.obtenerProgreso(1L);

        assertEquals(0.0, response.getPorcentaje());
        assertEquals(0, response.getTotal());
    }

    @Test
    void obtenerProgreso_todoCorrecto_debeRetornar100() {
        when(resultadoRepository.findByUsuarioId(1L))
                .thenReturn(List.of(correcto, correcto, correcto));
        when(resultadoRepository.countByUsuarioIdAndCorrectoTrue(1L)).thenReturn(3L);

        ProgresoResponse response = progresoService.obtenerProgreso(1L);

        assertEquals(100.0, response.getPorcentaje());
    }

    @Test
    void obtenerProgreso_debeContarTotalCorrectamente() {
        when(resultadoRepository.findByUsuarioId(1L))
                .thenReturn(List.of(correcto, incorrecto, correcto));
        when(resultadoRepository.countByUsuarioIdAndCorrectoTrue(1L)).thenReturn(2L);

        ProgresoResponse response = progresoService.obtenerProgreso(1L);

        assertEquals(3, response.getTotal());
    }
}