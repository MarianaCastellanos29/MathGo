package com.mathgo.mathgo.service;

import com.mathgo.mathgo.model.ProgresoGrado;
import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.ProgresoGradoRepository;
import com.mathgo.mathgo.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProgresoGradoServiceTest {

    @Mock private ProgresoGradoRepository progresoRepository;
    @Mock private UsuarioRepository usuarioRepository;

    private ProgresoGradoService servicio;
    private Usuario alumno;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        servicio = new ProgresoGradoService(progresoRepository, usuarioRepository);

        alumno = new Usuario();
        alumno.setId(1L);
        alumno.setGrado(4);
        alumno.setNivelActual(1);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArgument(0));
        when(progresoRepository.save(any(ProgresoGrado.class))).thenAnswer(i -> i.getArgument(0));
    }

    private ProgresoGrado fila(int grado, int completados) {
        ProgresoGrado f = new ProgresoGrado();
        f.setUsuarioId(1L);
        f.setGrado(grado);
        f.setNivelesCompletados(completados);
        return f;
    }

    // ---------- nivelActualDesde ----------

    @Test
    void nivelActualDesde_siguienteNivelSinPasarDeTres() {
        assertEquals(1, ProgresoGradoService.nivelActualDesde(0));
        assertEquals(2, ProgresoGradoService.nivelActualDesde(1));
        assertEquals(3, ProgresoGradoService.nivelActualDesde(2));
        assertEquals(3, ProgresoGradoService.nivelActualDesde(3));
        assertEquals(1, ProgresoGradoService.nivelActualDesde(-5));
    }

    // ---------- leerCompletados ----------

    @Test
    void leerCompletados_sinGrado_esCero() {
        alumno.setGrado(null);
        assertEquals(0, servicio.leerCompletados(alumno));
    }

    @Test
    void leerCompletados_conFila_devuelveLoGuardado() {
        when(progresoRepository.findByUsuarioIdAndGrado(1L, 4)).thenReturn(Optional.of(fila(4, 2)));
        assertEquals(2, servicio.leerCompletados(alumno));
    }

    @Test
    void leerCompletados_sinFila_heredaDelNivelGuardadoYNoEscribe() {
        alumno.setNivelActual(3);
        when(progresoRepository.findByUsuarioIdAndGrado(1L, 4)).thenReturn(Optional.empty());

        assertEquals(2, servicio.leerCompletados(alumno));
        verify(progresoRepository, never()).save(any(ProgresoGrado.class));
    }

    // ---------- registrarNivelCompletado ----------

    @Test
    void registrarNivelCompletado_siguienteNivel_avanza() {
        ProgresoGrado f = fila(4, 1);
        when(progresoRepository.findByUsuarioIdAndGrado(1L, 4)).thenReturn(Optional.of(f));

        Usuario resultado = servicio.registrarNivelCompletado(1L, 2);

        assertEquals(2, f.getNivelesCompletados());
        assertEquals(3, resultado.getNivelActual());
    }

    @Test
    void registrarNivelCompletado_nivelTres_completaElGrado() {
        ProgresoGrado f = fila(4, 2);
        when(progresoRepository.findByUsuarioIdAndGrado(1L, 4)).thenReturn(Optional.of(f));

        Usuario resultado = servicio.registrarNivelCompletado(1L, 3);

        assertEquals(3, f.getNivelesCompletados());
        assertEquals(3, resultado.getNivelActual());
        assertEquals(3, servicio.leerCompletados(resultado));
    }

    @Test
    void registrarNivelCompletado_repetirUnNivelYaHecho_noCambiaNada() {
        ProgresoGrado f = fila(4, 2);
        when(progresoRepository.findByUsuarioIdAndGrado(1L, 4)).thenReturn(Optional.of(f));

        servicio.registrarNivelCompletado(1L, 1);

        assertEquals(2, f.getNivelesCompletados());
        verify(progresoRepository, never()).save(any(ProgresoGrado.class));
    }

    @Test
    void registrarNivelCompletado_saltarseNiveles_noCambiaNada() {
        ProgresoGrado f = fila(4, 0);
        when(progresoRepository.findByUsuarioIdAndGrado(1L, 4)).thenReturn(Optional.of(f));

        Usuario resultado = servicio.registrarNivelCompletado(1L, 3);

        assertEquals(0, f.getNivelesCompletados());
        assertEquals(1, resultado.getNivelActual());
    }

    @Test
    void registrarNivelCompletado_nivelInvalido_lanza400() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> servicio.registrarNivelCompletado(1L, 4));
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void registrarNivelCompletado_sinGrado_lanza400() {
        alumno.setGrado(null);
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> servicio.registrarNivelCompletado(1L, 1));
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void registrarNivelCompletado_usuarioInexistente_lanza404() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> servicio.registrarNivelCompletado(99L, 1));
        assertEquals(404, ex.getStatusCode().value());
    }

    // ---------- cambio de grado ----------

    @Test
    void aplicarGrado_gradoYaVisitado_recuperaSuNivel() {
        when(progresoRepository.findByUsuarioIdAndGrado(1L, 4)).thenReturn(Optional.of(fila(4, 2)));

        Usuario resultado = servicio.aplicarGrado(alumno);

        assertEquals(3, resultado.getNivelActual());
    }

    @Test
    void aplicarGrado_gradoNuevo_empiezaEnElNivelUno() {
        alumno.setNivelActual(1); // UsuarioService ya lo reinicia al cambiar de grado
        when(progresoRepository.findByUsuarioIdAndGrado(1L, 4)).thenReturn(Optional.empty());

        Usuario resultado = servicio.aplicarGrado(alumno);

        assertEquals(1, resultado.getNivelActual());
        ArgumentCaptor<ProgresoGrado> captor = ArgumentCaptor.forClass(ProgresoGrado.class);
        verify(progresoRepository).save(captor.capture());
        assertEquals(0, captor.getValue().getNivelesCompletados());
    }

    @Test
    void aplicarGrado_sinGrado_noHaceNada() {
        alumno.setGrado(null);

        Usuario resultado = servicio.aplicarGrado(alumno);

        assertSame(alumno, resultado);
        verify(progresoRepository, never()).save(any(ProgresoGrado.class));
    }

    @Test
    void asegurarProgresoDelGradoActual_alumnoAnterior_guardaSuAvance() {
        alumno.setNivelActual(2);
        when(progresoRepository.findByUsuarioIdAndGrado(1L, 4)).thenReturn(Optional.empty());

        servicio.asegurarProgresoDelGradoActual(alumno);

        ArgumentCaptor<ProgresoGrado> captor = ArgumentCaptor.forClass(ProgresoGrado.class);
        verify(progresoRepository).save(captor.capture());
        assertEquals(4, captor.getValue().getGrado());
        assertEquals(1, captor.getValue().getNivelesCompletados());
    }
}
