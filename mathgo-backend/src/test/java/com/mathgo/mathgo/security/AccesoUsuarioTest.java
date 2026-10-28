package com.mathgo.mathgo.security;

import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.UsuarioRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class AccesoUsuarioTest {

    @Mock private UsuarioRepository usuarioRepository;

    private AccesoUsuario acceso;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        acceso = new AccesoUsuario(usuarioRepository);

        Usuario ana = new Usuario();
        ana.setId(5L);
        ana.setCorreo("ana@correo.com");
        when(usuarioRepository.findByCorreo("ana@correo.com")).thenReturn(ana);

        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void limpiar() {
        SecurityContextHolder.clearContext();
    }

    private void autenticarComo(String correo, String... roles) {
        List<SimpleGrantedAuthority> autoridades = Arrays.stream(roles)
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                .toList();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(correo, null, autoridades));
    }

    // ---------- puedeAcceder ----------

    @Test
    void puedeAcceder_alumnoConSuPropioId_esTrue() {
        autenticarComo("ana@correo.com", "ALUMNO");
        assertTrue(acceso.puedeAcceder(5L));
    }

    @Test
    void puedeAcceder_alumnoConIdDeOtro_esFalse() {
        autenticarComo("ana@correo.com", "ALUMNO");
        assertFalse(acceso.puedeAcceder(6L));
    }

    @Test
    void puedeAcceder_padre_puedeVerCualquierAlumno() {
        autenticarComo("padre@correo.com", "PADRE");
        assertTrue(acceso.puedeAcceder(6L));
    }

    @Test
    void puedeAcceder_admin_puedeVerCualquierAlumno() {
        autenticarComo("admin@correo.com", "ADMIN");
        assertTrue(acceso.puedeAcceder(99L));
    }

    @Test
    void puedeAcceder_sinAutenticacion_esFalse() {
        assertFalse(acceso.puedeAcceder(5L));
    }

    @Test
    void puedeAcceder_idNulo_esFalseParaAlumno() {
        autenticarComo("ana@correo.com", "ALUMNO");
        assertFalse(acceso.puedeAcceder(null));
    }

    @Test
    void puedeAcceder_idComoTexto_seInterpretaComoNumero() {
        autenticarComo("ana@correo.com", "ALUMNO");
        assertTrue(acceso.puedeAcceder("5"));
    }

    @Test
    void puedeAcceder_idComoEntero_seInterpretaComoNumero() {
        autenticarComo("ana@correo.com", "ALUMNO");
        assertTrue(acceso.puedeAcceder(Integer.valueOf(5)));
    }

    @Test
    void puedeAcceder_idInvalido_esFalse() {
        autenticarComo("ana@correo.com", "ALUMNO");
        assertFalse(acceso.puedeAcceder("abc"));
    }

    @Test
    void puedeAcceder_correoQueNoExisteEnBd_esFalse() {
        autenticarComo("fantasma@correo.com", "ALUMNO");
        assertFalse(acceso.puedeAcceder(5L));
    }

    // ---------- esPropietario ----------

    @Test
    void esPropietario_elPropioUsuario_esTrue() {
        autenticarComo("ana@correo.com", "ALUMNO");
        assertTrue(acceso.esPropietario(5L));
    }

    @Test
    void esPropietario_padreSobreOtroUsuario_esFalse() {
        autenticarComo("padre@correo.com", "PADRE");
        assertFalse(acceso.esPropietario(5L));
    }
}
