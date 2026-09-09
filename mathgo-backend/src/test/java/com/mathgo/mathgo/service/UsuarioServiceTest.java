package com.mathgo.mathgo.service;

import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {

    @Mock private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registrarUsuario_debeAsignar5Vidas() {
        Usuario u = new Usuario();
        when(usuarioRepository.save(any())).thenReturn(u);
        Usuario resultado = usuarioService.registrarUsuario(u);
        assertEquals(5, resultado.getVidas());
    }

    @Test
    void registrarUsuario_debeAsignarNivel1() {
        Usuario u = new Usuario();
        when(usuarioRepository.save(any())).thenReturn(u);
        Usuario resultado = usuarioService.registrarUsuario(u);
        assertEquals(1, resultado.getNivelActual());
    }

    @Test
    void registrarUsuario_sinRol_debeAsignarALUMNO() {
        Usuario u = new Usuario();
        when(usuarioRepository.save(any())).thenReturn(u);
        Usuario resultado = usuarioService.registrarUsuario(u);
        assertEquals("ALUMNO", resultado.getRol());
    }

    @Test
    void registrarUsuario_conRolDefinido_debeMantenerlO() {
        Usuario u = new Usuario();
        u.setRol("PADRE");
        when(usuarioRepository.save(any())).thenReturn(u);
        Usuario resultado = usuarioService.registrarUsuario(u);
        assertEquals("PADRE", resultado.getRol());
    }

    @Test
    void registrarUsuario_debeLlamarSave() {
        Usuario u = new Usuario();
        when(usuarioRepository.save(any())).thenReturn(u);
        usuarioService.registrarUsuario(u);
        verify(usuarioRepository, times(1)).save(u);
    }
}