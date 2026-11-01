package com.mathgo.mathgo.service;

import com.mathgo.mathgo.model.ProgresoGrado;
import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.ProgresoGradoRepository;
import com.mathgo.mathgo.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

/**
 * Recuerda el avance del alumno por grado. Usuario.nivelActual sigue siendo el nivel que le toca
 * jugar en su grado actual (1 a 3); aquí se guarda cuántos niveles completó en cada grado.
 */
@Service
public class ProgresoGradoService {

    public static final int NIVELES_POR_GRADO = 3;

    private final ProgresoGradoRepository progresoRepository;
    private final UsuarioRepository usuarioRepository;

    public ProgresoGradoService(ProgresoGradoRepository progresoRepository,
                                UsuarioRepository usuarioRepository) {
        this.progresoRepository = progresoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /** Nivel que le toca jugar a quien ya completó esa cantidad de niveles (1 a 3). */
    public static int nivelActualDesde(int completados) {
        return Math.min(Math.max(completados, 0) + 1, NIVELES_POR_GRADO);
    }

    /** Niveles completados en el grado actual del alumno. No escribe en la base de datos. */
    public int leerCompletados(Usuario usuario) {
        if (usuario.getGrado() == null) {
            return 0;
        }
        return progresoRepository.findByUsuarioIdAndGrado(usuario.getId(), usuario.getGrado())
                .map(ProgresoGrado::getNivelesCompletados)
                .orElseGet(() -> completadosHeredados(usuario, usuario.getGrado()));
    }

    /**
     * Antes de cambiar de grado: guarda el avance del grado que se deja, para que no se pierda
     * (los alumnos anteriores a esta función solo tenían el nivel guardado en el usuario).
     */
    public void asegurarProgresoDelGradoActual(Usuario usuario) {
        if (usuario.getGrado() != null) {
            obtenerFila(usuario, usuario.getGrado());
        }
    }

    /** Deja el nivel del alumno según lo que ya avanzó en su grado actual. */
    public Usuario aplicarGrado(Usuario usuario) {
        if (usuario.getGrado() == null) {
            return usuario;
        }
        ProgresoGrado fila = obtenerFila(usuario, usuario.getGrado());
        usuario.setNivelActual(nivelActualDesde(fila.getNivelesCompletados()));
        return usuarioRepository.save(usuario);
    }

    /** Anota que el alumno terminó un nivel de su grado actual. */
    public Usuario registrarNivelCompletado(Long usuarioId, int nivel) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (usuario.getGrado() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El alumno aún no ha elegido su grado");
        }
        if (nivel < 1 || nivel > NIVELES_POR_GRADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El nivel debe estar entre 1 y " + NIVELES_POR_GRADO);
        }

        ProgresoGrado fila = obtenerFila(usuario, usuario.getGrado());
        // Solo cuenta el siguiente nivel: repetir uno ya hecho o saltarse niveles no cambia nada
        if (nivel == fila.getNivelesCompletados() + 1) {
            fila.setNivelesCompletados(nivel);
            progresoRepository.save(fila);
        }
        usuario.setNivelActual(nivelActualDesde(fila.getNivelesCompletados()));
        return usuarioRepository.save(usuario);
    }

    private ProgresoGrado obtenerFila(Usuario usuario, int grado) {
        return progresoRepository.findByUsuarioIdAndGrado(usuario.getId(), grado).orElseGet(() -> {
            ProgresoGrado nuevo = new ProgresoGrado();
            nuevo.setUsuarioId(usuario.getId());
            nuevo.setGrado(grado);
            nuevo.setNivelesCompletados(completadosHeredados(usuario, grado));
            return progresoRepository.save(nuevo);
        });
    }

    /** Alumnos anteriores a esta función: el avance de su grado actual sale del nivel guardado. */
    private int completadosHeredados(Usuario usuario, int grado) {
        if (!Objects.equals(usuario.getGrado(), grado)) {
            return 0;
        }
        return Math.max(0, Math.min(usuario.getNivelActual() - 1, NIVELES_POR_GRADO));
    }
}
