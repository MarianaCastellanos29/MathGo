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

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registrarUsuario_debeAsignarVidas5() {
        Usuario usuario = new Usuario();
        usuario.setNombre("Maria");
        usuario.setCorreo("maria@test.com");
        usuario.setPassword("123456");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        Usuario resultado = usuarioService.registrarUsuario(usuario);

        assertEquals(5, resultado.getVidas());
    }

    @Test
    void registrarUsuario_debeAsignarNivelActual1() {
        Usuario usuario = new Usuario();
        usuario.setNombre("Juan");
        usuario.setCorreo("juan@test.com");
        usuario.setPassword("123456");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        Usuario resultado = usuarioService.registrarUsuario(usuario);

        assertEquals(1, resultado.getNivelActual());
    }

    @Test
    void registrarUsuario_debeAsignarRolALUMNO_siNoTieneRol() {
        Usuario usuario = new Usuario();
        usuario.setNombre("Pedro");
        usuario.setCorreo("pedro@test.com");
        usuario.setPassword("123456");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        Usuario resultado = usuarioService.registrarUsuario(usuario);

        assertEquals("ALUMNO", resultado.getRol());
    }

    @Test
    void registrarUsuario_debeRespetar_rolPADRE_siYaLleva() {
        Usuario usuario = new Usuario();
        usuario.setNombre("Carlos");
        usuario.setCorreo("carlos@test.com");
        usuario.setPassword("123456");
        usuario.setRol("PADRE");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        Usuario resultado = usuarioService.registrarUsuario(usuario);

        assertEquals("PADRE", resultado.getRol());
    }
}