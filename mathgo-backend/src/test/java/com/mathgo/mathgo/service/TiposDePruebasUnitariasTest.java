package com.mathgo.mathgo.service;

import com.mathgo.mathgo.model.Ejercicio;
import com.mathgo.mathgo.model.Resultado;
import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.EjercicioRepository;
import com.mathgo.mathgo.repository.ResultadoRepository;
import com.mathgo.mathgo.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * ============================================================================
 *  DEMOSTRACIÓN: los tipos de pruebas unitarias aplicados al backend de MathGo
 * ============================================================================
 * Este archivo reúne exactamente 6 pruebas, cada una representando una
 * categoría distinta de las vistas en la guía (caja negra, caja blanca,
 * camino feliz, límites, camino negativo, interacción/mocks y estado).
 * Todas siguen la estructura AAA (Arrange, Act, Assert).
 *
 * No reemplazan la suite de pruebas ya existente del proyecto (LogroServiceTest,
 * UsuarioServiceTest, EjercicioServiceTest, etc.) — ese archivo es un resumen
 * aparte, pensado para explicar y entregar el concepto.
 */
@DisplayName("Los 6 tipos de pruebas unitarias aplicados a MathGo")
class TiposDePruebasUnitariasTest {

    @Mock private EjercicioRepository ejercicioRepository;
    @Mock private ResultadoRepository resultadoRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private LogroService logroServiceMock;

    @InjectMocks private EjercicioService ejercicioService;

    private final LogroService logroService = new LogroService(null, null, null);
    private final UsuarioService usuarioService = new UsuarioService(null);

    private Usuario usuario;
    private Ejercicio ejercicio;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setVidas(5);
        usuario.setNivelActual(1);
        usuario.setRachaActual(3);
        usuario.setMejorRacha(3);
        usuario.setXp(0);

        ejercicio = new Ejercicio();
        ejercicio.setId(1L);
        ejercicio.setNivel(1);
        ejercicio.setPregunta("¿Cuánto es 2 + 3?");
        ejercicio.setRespuestaCorrecta("B");
        ejercicio.setExplicacion("2 + 3 = 5");
    }

    // ========================================================================
    // 1) CAJA NEGRA + CAMINO FELIZ
    //    No miramos el código de calcularRango(): solo conocemos la regla de
    //    negocio documentada ("150 de xp = rango Estudiante") y probamos que
    //    la salida sea la esperada para una entrada típica y válida.
    // ========================================================================
    @DisplayName("1. CAJA NEGRA (camino feliz) - 150 xp debe dar rango Estudiante")
    @Test
    void cajaNegra_calcularRango_xpTipico_debeRetornarEstudiante() {
        // Arrange
        int xpDelAlumno = 150;

        // Act
        String rango = logroService.calcularRango(xpDelAlumno);

        // Assert
        assertEquals("Estudiante", rango);
    }

    // ========================================================================
    // 2) CAJA BLANCA + PRUEBA DE LÍMITES/FRONTERAS
    //    Aquí SÍ miramos el código fuente: "if (xp >= 80) return Estudiante".
    //    Solo conociendo esa línea exacta sabemos que 79 y 80 son los dos
    //    valores que de verdad ponen a prueba la frontera (un enfoque de caja
    //    negra pudo haber probado 0, 50, 100 y nunca habría detectado un
    //    error de "off-by-one" si el operador fuera ">" en vez de ">=").
    // ========================================================================
    @DisplayName("2. CAJA BLANCA (limite/frontera) - el cambio exacto de rango esta en 80 xp")
    @Test
    void cajaBlanca_calcularRango_fronteraExactaDe80_debeCambiarDeRango() {
        // Arrange / Act / Assert (frontera inferior y superior en una sola prueba)
        assertEquals("Aprendiz", logroService.calcularRango(79));   // un punto antes de la frontera
        assertEquals("Estudiante", logroService.calcularRango(80)); // exactamente en la frontera
    }

    // ========================================================================
    // 3) CAMINO NEGATIVO (dato inválido/ausente) — enfoque de caja negra:
    //    la regla "si no mandan rol, se asigna ALUMNO" es un requisito de
    //    negocio conocido sin necesidad de leer la implementación.
    // ========================================================================
    @DisplayName("3. CAJA NEGRA (camino negativo) - sin rol, debe asignar ALUMNO por defecto")
    @Test
    void caminoNegativo_registrarUsuario_sinRol_debeAsignarAlumnoPorDefecto() {
        // Arrange
        UsuarioRepository repoFalso = mock(UsuarioRepository.class);
        UsuarioService servicio = new UsuarioService(repoFalso);
        Usuario nuevo = new Usuario();
        nuevo.setRol(null); // dato "inválido" / ausente
        when(repoFalso.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // Act
        Usuario resultado = servicio.registrarUsuario(nuevo);

        // Assert
        assertEquals("ALUMNO", resultado.getRol());
    }

    // ========================================================================
    // 4) CAJA BLANCA + CAMINO NEGATIVO (manejo de excepción):
    //    Solo leyendo EjercicioService.responder() sabemos que usa
    //    ".orElseThrow(() -> new RuntimeException(...))" — por eso probamos
    //    puntualmente ese tipo de excepción y no, por ejemplo, un valor nulo.
    // ========================================================================
    @DisplayName("4. CAJA BLANCA (camino negativo/excepcion) - ejercicio inexistente debe lanzar error")
    @Test
    void cajaBlanca_responder_ejercicioInexistente_debeLanzarRuntimeException() {
        // Arrange
        when(ejercicioRepository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(RuntimeException.class,
                () -> ejercicioService.responder(1L, 99L, "A"));
    }

    // ========================================================================
    // 5) PRUEBA BASADA EN INTERACCIÓN (Mock):
    //    No nos interesa qué hace exactamente LogroService por dentro, solo
    //    que EjercicioService lo haya llamado después de guardar una
    //    respuesta correcta (comportamiento esperado entre dos componentes).
    // ========================================================================
    @DisplayName("5. INTERACCION (mock) - respuesta correcta debe avisarle a LogroService")
    @Test
    void interaccion_responder_respuestaCorrecta_debeLlamarAVerificarLogros() {
        // Arrange
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(ejercicioRepository.findByNivel(1)).thenReturn(List.of(ejercicio));
        when(resultadoRepository.contarCorrectosPorNivel(1L, 1)).thenReturn(1L);
        when(logroServiceMock.calcularRango(anyInt())).thenReturn("Aprendiz");
        when(logroServiceMock.verificarLogros(any())).thenReturn(List.of());

        // Act
        ejercicioService.responder(1L, 1L, "B"); // "B" es la respuesta correcta

        // Assert: verificamos la LLAMADA, no un valor de retorno
        verify(logroServiceMock, times(1)).verificarLogros(usuario);
    }

    // ========================================================================
    // 6) PRUEBA BASADA EN ESTADO:
    //    Ejecutamos una acción y comprobamos cómo cambió el estado interno
    //    del objeto "usuario" (vidas y racha), no el valor que retorna el
    //    método.
    // ========================================================================
    @DisplayName("6. ESTADO - respuesta incorrecta debe bajar vidas y reiniciar la racha")
    @Test
    void basadaEnEstado_responder_respuestaIncorrecta_debeCambiarVidasYRacha() {
        // Arrange
        when(ejercicioRepository.findById(1L)).thenReturn(Optional.of(ejercicio));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(new Resultado());
        when(logroServiceMock.verificarLogros(any())).thenReturn(List.of());

        // Act
        ejercicioService.responder(1L, 1L, "A"); // "A" es incorrecta (la correcta es "B")

        // Assert: el estado del objeto usuario cambió
        assertEquals(4, usuario.getVidas());     // tenía 5, debe quedar en 4
        assertEquals(0, usuario.getRachaActual()); // tenía 3, se reinicia a 0
    }
}