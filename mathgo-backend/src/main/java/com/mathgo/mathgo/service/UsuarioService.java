package com.mathgo.mathgo.service;

import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        usuario.setVidas(5);
        usuario.setNivelActual(1);
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("ALUMNO");
        }
        return usuarioRepository.save(usuario);
    }
}