package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.model.Logro;
import com.mathgo.mathgo.repository.LogroRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LogroControllerTest {

    @Mock private LogroRepository logroRepository;

    @InjectMocks private LogroController logroController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void obtenerTodos_debeRetornarLogros() {
        Logro logro = new Logro();
        logro.setId(1L);
        logro.setNombre("Primera racha");
        when(logroRepository.findAll()).thenReturn(List.of(logro));

        List<Logro> result = logroController.obtenerTodos();
        assertEquals(1, result.size());
    }

    @Test
    void obtenerTodos_sinLogros_debeRetornarVacio() {
        when(logroRepository.findAll()).thenReturn(List.of());
        List<Logro> result = logroController.obtenerTodos();
        assertTrue(result.isEmpty());
    }
}