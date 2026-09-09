package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.dto.RespuestaRequest;
import com.mathgo.mathgo.dto.RespuestaResponse;
import com.mathgo.mathgo.model.Ejercicio;
import com.mathgo.mathgo.service.EjercicioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Ejercicios", description = "Gestión y respuesta de ejercicios")
@RestController
@RequestMapping("/ejercicios")
@CrossOrigin(origins = "http://localhost:4200")
public class EjercicioController {

    private final EjercicioService ejercicioService;

    public EjercicioController(EjercicioService ejercicioService) {
        this.ejercicioService = ejercicioService;
    }

    @Operation(summary = "Listar todos los ejercicios")
    @GetMapping
    public List<Ejercicio> listar() {
        return ejercicioService.obtenerEjercicios();
    }

    @Operation(summary = "Obtener ejercicios por nivel para un usuario")
    @GetMapping("/nivel/{usuarioId}/{nivel}")
    public List<Ejercicio> porNivel(@PathVariable Long usuarioId, @PathVariable String nivel) {
        return ejercicioService.obtenerEjerciciosPorNivelUsuario(usuarioId, nivel);
    }

    @Operation(summary = "Responder un ejercicio")
    @PostMapping("/responder")
    public RespuestaResponse responder(@RequestBody RespuestaRequest request) {
        return ejercicioService.responder(
                request.getUsuarioId(),
                request.getEjercicioId(),
                request.getRespuesta());
    }
}