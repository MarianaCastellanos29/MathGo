package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.dto.ProgresoResponse;
import com.mathgo.mathgo.service.ProgresoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProgresoControllerTest {

    @Mock private ProgresoService progresoService;
    @InjectMocks private ProgresoController progresoController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void obtener_debeRetornarProgreso() {
        ProgresoResponse response = new ProgresoResponse(10, 8, 80.0);
        when(progresoService.obtenerProgreso(1L)).thenReturn(response);

        ProgresoResponse result = progresoController.obtener(1L);

        assertEquals(80.0, result.getPorcentaje());
        assertEquals(10, result.getTotal());
    }

    @Test
    void obtener_sinResultados_debeRetornarCero() {
        ProgresoResponse response = new ProgresoResponse(0, 0, 0.0);
        when(progresoService.obtenerProgreso(1L)).thenReturn(response);

        ProgresoResponse result = progresoController.obtener(1L);

        assertEquals(0.0, result.getPorcentaje());
        assertEquals(0, result.getTotal());
    }
}