package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.service.ProgresoGradoService;
import com.mathgo.mathgo.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

/**
 * Endpoints para el grado escolar del niño y su avance en cada grado.
 * GET  /usuarios/{id}/grado                          -> { id, rol, grado, nivelActual, nivelesCompletados, gradoCompletado }
 * PUT  /usuarios/{id}/grado  body {"grado": 3}       -> igual; conserva el avance de cada grado
 * POST /usuarios/{id}/grado/nivel-completado {"nivel": 2} -> igual; anota un nivel terminado (solo el propio alumno)
 */
@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class GradoController {

    private final UsuarioService usuarioService;
    private final ProgresoGradoService progresoGradoService;

    public GradoController(UsuarioService usuarioService, ProgresoGradoService progresoGradoService) {
        this.usuarioService = usuarioService;
        this.progresoGradoService = progresoGradoService;
    }

    @PreAuthorize("@acceso.puedeAcceder(#id)")
    @GetMapping("/{id}/grado")
    public ResponseEntity<Map<String, Object>> obtenerGrado(@PathVariable Long id) {
        return ResponseEntity.ok(aMapa(usuarioService.obtenerUsuario(id)));
    }

    @PreAuthorize("@acceso.puedeAcceder(#id)")
    @PutMapping("/{id}/grado")
    public ResponseEntity<Map<String, Object>> actualizarGrado(@PathVariable Long id,
                                                               @RequestBody Map<String, Integer> body) {
        // 1) se guarda el avance del grado que se deja, 2) se cambia de grado,
        // 3) el nivel pasa a ser el que ya llevaba en el grado nuevo (o 1 si es la primera vez)
        Usuario anterior = usuarioService.obtenerUsuario(id);
        progresoGradoService.asegurarProgresoDelGradoActual(anterior);
        Usuario usuario = usuarioService.actualizarGrado(id, body.get("grado"));
        usuario = progresoGradoService.aplicarGrado(usuario);
        return ResponseEntity.ok(aMapa(usuario));
    }

    @PreAuthorize("@acceso.esPropietario(#id)")
    @PostMapping("/{id}/grado/nivel-completado")
    public ResponseEntity<Map<String, Object>> nivelCompletado(@PathVariable Long id,
                                                               @RequestBody Map<String, Integer> body) {
        Integer nivel = body.get("nivel");
        if (nivel == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Falta el nivel");
        }
        return ResponseEntity.ok(aMapa(progresoGradoService.registrarNivelCompletado(id, nivel)));
    }

    private Map<String, Object> aMapa(Usuario u) {
        int completados = progresoGradoService.leerCompletados(u);
        Map<String, Object> r = new HashMap<>();
        r.put("id", u.getId());
        r.put("rol", u.getRol());
        r.put("grado", u.getGrado());
        r.put("nivelActual", u.getNivelActual());
        r.put("nivelesCompletados", completados);
        r.put("gradoCompletado",
                u.getGrado() != null && completados >= ProgresoGradoService.NIVELES_POR_GRADO);
        return r;
    }
}
