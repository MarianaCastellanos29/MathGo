package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Endpoints para el grado escolar del niño.
 * GET /usuarios/{id}/grado                      -> { id, rol, grado, nivelActual }
 * PUT /usuarios/{id}/grado  body {"grado": 3}   -> { id, rol, grado, nivelActual }
 */
@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class GradoController {

    private final UsuarioService usuarioService;

    public GradoController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/{id}/grado")
    public ResponseEntity<Map<String, Object>> obtenerGrado(@PathVariable Long id) {
        return ResponseEntity.ok(aMapa(usuarioService.obtenerUsuario(id)));
    }

    @PutMapping("/{id}/grado")
    public ResponseEntity<Map<String, Object>> actualizarGrado(@PathVariable Long id,
                                                               @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(aMapa(usuarioService.actualizarGrado(id, body.get("grado"))));
    }

    private Map<String, Object> aMapa(Usuario u) {
        Map<String, Object> r = new HashMap<>();
        r.put("id", u.getId());
        r.put("rol", u.getRol());
        r.put("grado", u.getGrado());
        r.put("nivelActual", u.getNivelActual());
        return r;
    }
}
