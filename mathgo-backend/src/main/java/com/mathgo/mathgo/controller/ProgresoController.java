package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.dto.ProgresoResponse;
import com.mathgo.mathgo.service.ProgresoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Progreso", description = "Consulta el progreso del alumno")
@RestController
@RequestMapping("/progreso")
@CrossOrigin(origins = "http://localhost:4200")
public class ProgresoController {

    private final ProgresoService progresoService;

    public ProgresoController(ProgresoService progresoService) {
        this.progresoService = progresoService;
    }

    @Operation(summary = "Obtener progreso de un usuario")
    @GetMapping("/{usuarioId}")
    public ProgresoResponse obtener(@PathVariable Long usuarioId) {
        return progresoService.obtenerProgreso(usuarioId);
    }
}