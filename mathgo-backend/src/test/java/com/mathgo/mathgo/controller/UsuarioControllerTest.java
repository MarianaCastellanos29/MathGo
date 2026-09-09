package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.dto.LoginRequest;
import com.mathgo.mathgo.dto.RegistroRequest;
import com.mathgo.mathgo.dto.UsuarioDTO;
import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.ResultadoRepository;
import com.mathgo.mathgo.repository.UsuarioRepository;
import com.mathgo.mathgo.service.UsuarioService;
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

class UsuarioControllerTest {

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private UsuarioService usuarioService;
    @Mock private ResultadoRepository resultadoRepository;

    @InjectMocks
    private UsuarioController usuarioController;

    private Usuario alumno;
    private Usuario padre;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        alumno = new Usuario();
        alumno.setId(1L);
        alumno.setNombre("lilo");
        alumno.setCorreo("lilo@gmail.com");
        alumno.setPassword("123456");
        alumno.setRol("ALUMNO");
        alumno.setVidas(3);

        padre = new Usuario();
        padre.setId(2L);
        padre.setNombre("pablo");
        padre.setCorreo("pablo@gmail.com");
        padre.setPassword("123456");
        padre.setRol("PADRE");
        padre.setVidas(5);
    }

    @Test
    void obtenerAlumnos_debeRetornarSoloAlumnos() {
        when(usuarioRepository.findAll()).thenReturn(List.of(alumno, padre));
        List<UsuarioDTO> resultado = usuarioController.obtenerAlumnos();
        assertEquals(1, resultado.size());
        assertEquals("ALUMNO", resultado.get(0).getRol());
    }

    @Test
    void obtenerUsuarioPorId_existente_debeRetornar200() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        ResponseEntity<UsuarioDTO> response = usuarioController.obtener(1L);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("lilo", response.getBody().getNombre());
    }

    @Test
    void obtenerUsuarioPorId_noExistente_debeRetornar404() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());
        ResponseEntity<UsuarioDTO> response = usuarioController.obtener(99L);
        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void darVidas_debeRestaurarAMaximo5() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(usuarioRepository.save(any())).thenReturn(alumno);
        ResponseEntity<?> response = usuarioController.darVidas(1L, Map.of("vidas", 5));
        assertEquals(200, response.getStatusCode().value());
        assertEquals(5, alumno.getVidas());
    }

    @Test
    void darVidas_noDebeExceder5() {
        alumno.setVidas(4);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(usuarioRepository.save(any())).thenReturn(alumno);
        usuarioController.darVidas(1L, Map.of("vidas", 5));
        assertTrue(alumno.getVidas() <= 5);
    }

    @Test
    void enviarMensaje_debeGuardarMensaje() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(usuarioRepository.save(any())).thenReturn(alumno);
        ResponseEntity<?> response = usuarioController.enviarMensaje(1L, Map.of("mensaje", "¡Sigue adelante!"));
        assertEquals(200, response.getStatusCode().value());
        assertEquals("¡Sigue adelante!", alumno.getMensajePadre());
    }

    @Test
    void buscarAlumno_debeRetornarCoincidencias() {
        when(usuarioRepository.findAll()).thenReturn(List.of(alumno, padre));
        ResponseEntity<?> response = usuarioController.buscar("lilo");
        List<?> resultado = (List<?>) response.getBody();
        assertEquals(1, resultado.size());
    }

    @Test
    void loginNino_credencialesCorrectas_debeRetornar200() {
        when(usuarioRepository.findByCorreo("lilo@gmail.com")).thenReturn(alumno);
        LoginRequest req = new LoginRequest();
        req.setCorreo("lilo@gmail.com");
        req.setPassword("123456");
        ResponseEntity<?> response = usuarioController.loginNino(req);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void loginNino_credencialesIncorrectas_debeRetornar401() {
        when(usuarioRepository.findByCorreo("lilo@gmail.com")).thenReturn(alumno);
        LoginRequest req = new LoginRequest();
        req.setCorreo("lilo@gmail.com");
        req.setPassword("wrongpass");
        ResponseEntity<?> response = usuarioController.loginNino(req);
        assertEquals(401, response.getStatusCode().value());
    }

    @Test
    void loginNino_conRolPadre_debeRetornar403() {
        when(usuarioRepository.findByCorreo("pablo@gmail.com")).thenReturn(padre);
        LoginRequest req = new LoginRequest();
        req.setCorreo("pablo@gmail.com");
        req.setPassword("123456");
        ResponseEntity<?> response = usuarioController.loginNino(req);
        assertEquals(403, response.getStatusCode().value());
    }

    @Test
    void registrar_debeRetornar201() {
        when(usuarioService.registrarUsuario(any())).thenReturn(alumno);
        RegistroRequest req = new RegistroRequest();
        req.setNombre("lilo");
        req.setCorreo("lilo@gmail.com");
        req.setPassword("123456");
        req.setRol("ALUMNO");
        ResponseEntity<UsuarioDTO> response = usuarioController.registrar(req);
        assertEquals(201, response.getStatusCode().value());
        assertEquals("lilo", response.getBody().getNombre());
    }

    @Test
    void listar_debeRetornarTodosLosUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(List.of(alumno, padre));
        List<UsuarioDTO> resultado = usuarioController.listar();
        assertEquals(2, resultado.size());
    }

    @Test
    void obtenerMensaje_debeRetornarMensajeYBorrarlo() {
        alumno.setMensajePadre("Sigue adelante!");
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(usuarioRepository.save(any())).thenReturn(alumno);
        ResponseEntity<?> response = usuarioController.obtenerMensaje(1L);
        assertEquals(200, response.getStatusCode().value());
        assertNull(alumno.getMensajePadre());
    }

    @Test
    void obtenerMensaje_sinMensaje_debeRetornarVacio() {
        alumno.setMensajePadre(null);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(usuarioRepository.save(any())).thenReturn(alumno);
        ResponseEntity<?> response = usuarioController.obtenerMensaje(1L);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void darVidas_usuarioNoExistente_debeRetornar404() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());
        ResponseEntity<?> response = usuarioController.darVidas(99L, Map.of("vidas", 5));
        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void enviarMensaje_usuarioNoExistente_debeRetornar404() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());
        ResponseEntity<?> response = usuarioController.enviarMensaje(99L, Map.of("mensaje", "hola"));
        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void loginNino_usuarioNoExistente_debeRetornar401() {
        when(usuarioRepository.findByCorreo("noexiste@gmail.com")).thenReturn(null);
        LoginRequest req = new LoginRequest();
        req.setCorreo("noexiste@gmail.com");
        req.setPassword("123456");
        ResponseEntity<?> response = usuarioController.loginNino(req);
        assertEquals(401, response.getStatusCode().value());
    }
}