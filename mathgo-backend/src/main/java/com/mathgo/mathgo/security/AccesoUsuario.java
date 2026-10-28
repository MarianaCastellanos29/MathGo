package com.mathgo.mathgo.security;

import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Reglas de propiedad de los datos. Se usa desde @PreAuthorize:
 *   @PreAuthorize("@acceso.puedeAcceder(#usuarioId)")
 */
@Component("acceso")
public class AccesoUsuario {

    private final UsuarioRepository usuarioRepository;

    public AccesoUsuario(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /** El usuario autenticado es el dueño del dato, o es PADRE / ADMIN. */
    public boolean puedeAcceder(Object usuarioId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        if (tieneRol(auth, "ROLE_PADRE") || tieneRol(auth, "ROLE_ADMIN")) {
            return true;
        }
        return esPropietario(usuarioId);
    }

    /** El usuario autenticado es exactamente el dueño del dato (sin excepciones por rol). */
    public boolean esPropietario(Object usuarioId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long id = aLong(usuarioId);
        if (auth == null || !auth.isAuthenticated() || id == null || auth.getPrincipal() == null) {
            return false;
        }
        Usuario usuario = usuarioRepository.findByCorreo(String.valueOf(auth.getPrincipal()));
        return usuario != null && id.equals(usuario.getId());
    }

    private boolean tieneRol(Authentication auth, String rol) {
        return auth.getAuthorities().stream().anyMatch(a -> rol.equals(a.getAuthority()));
    }

    private Long aLong(Object valor) {
        if (valor == null) {
            return null;
        }
        try {
            return Long.valueOf(valor.toString().trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
