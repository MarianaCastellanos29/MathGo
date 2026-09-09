package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.model.Resultado;
import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.model.UsuarioLogro;
import com.mathgo.mathgo.repository.ResultadoRepository;
import com.mathgo.mathgo.repository.UsuarioRepository;
import com.mathgo.mathgo.service.LogroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Historial", description = "Historial de ejercicios y logros")
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/historial")
public class HistorialController {

    private final ResultadoRepository resultadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LogroService logroService;

    public HistorialController(ResultadoRepository resultadoRepository,
                               UsuarioRepository usuarioRepository,
                               LogroService logroService) {
        this.resultadoRepository = resultadoRepository;
        this.usuarioRepository = usuarioRepository;
        this.logroService = logroService;
    }

    @Operation(summary = "Obtener historial de un usuario")
    @GetMapping("/{usuarioId}")
    public List<Resultado> obtenerHistorial(@PathVariable Long usuarioId) {
        return resultadoRepository.findByUsuarioIdOrderByFechaRespuestaDesc(usuarioId);
    }

    @Operation(summary = "Guardar resultado de un ejercicio")
    @PostMapping("/guardar")
    public ResponseEntity<?> guardarResultado(@RequestBody Map<String, Object> body) {
        Long usuarioId = Long.valueOf(body.get("usuarioId").toString());
        String pregunta = body.get("pregunta").toString();
        int nivel = Integer.parseInt(body.get("nivel").toString());
        boolean correcto = Boolean.parseBoolean(body.get("correcto").toString());

        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        if (usuario == null) return ResponseEntity.badRequest().body("Usuario no encontrado");

        Resultado resultado = new Resultado();
        resultado.setUsuario(usuario);
        resultado.setPregunta(pregunta);
        resultado.setNivel(nivel);
        resultado.setCorrecto(correcto);
        resultadoRepository.save(resultado);

        if (correcto) {
            usuario.setRachaActual(usuario.getRachaActual() + 1);
            if (usuario.getRachaActual() > usuario.getMejorRacha()) {
                usuario.setMejorRacha(usuario.getRachaActual());
            }
            int xpGanado = nivel * 10;
            usuario.setXp(usuario.getXp() + xpGanado);
            usuario.setRango(logroService.calcularRango(usuario.getXp()));
        } else {
            usuario.setRachaActual(0);
        }

        usuarioRepository.save(usuario);
        logroService.verificarLogros(usuario);

        return ResponseEntity.ok(Map.of(
            "correcto", correcto,
            "xp", usuario.getXp(),
            "rango", usuario.getRango(),
            "rachaActual", usuario.getRachaActual(),
            "mejorRacha", usuario.getMejorRacha()
        ));
    }

    @Operation(summary = "Obtener logros de un usuario")
    @GetMapping("/{usuarioId}/logros")
    public List<UsuarioLogro> obtenerLogros(@PathVariable Long usuarioId) {
        return logroService.obtenerLogrosDeUsuario(usuarioId);
    }
}