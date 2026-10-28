package com.mathgo.mathgo.service;

import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.UsuarioRepository;
import com.mathgo.mathgo.security.PasswordUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    public static final int GRADO_MINIMO = 1;
    public static final int GRADO_MAXIMO = 5;

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        String password = usuario.getPassword();
        if (password != null) {
            if (password.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "La contraseña no puede estar vacía");
            }
            usuario.setPassword(PasswordUtil.encriptar(password));
        }
        usuario.setVidas(5);
        usuario.setNivelActual(1);
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("ALUMNO");
        }
        // El grado es opcional al registrarse; si viene, debe ser valido
        if (usuario.getGrado() != null) {
            validarGrado(usuario.getGrado());
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario obtenerUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario actualizarGrado(Long usuarioId, Integer grado) {
        validarGrado(grado);
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Integer gradoAnterior = usuario.getGrado();
        usuario.setGrado(grado);

        // Primera vez o cambio de grado: empieza desde el nivel 1
        if (gradoAnterior == null || !gradoAnterior.equals(grado)) {
            usuario.setNivelActual(1);
        }
        return usuarioRepository.save(usuario);
    }

    private void validarGrado(Integer grado) {
        if (grado == null || grado < GRADO_MINIMO || grado > GRADO_MAXIMO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El grado debe estar entre " + GRADO_MINIMO + " y " + GRADO_MAXIMO);
        }
    }
}
