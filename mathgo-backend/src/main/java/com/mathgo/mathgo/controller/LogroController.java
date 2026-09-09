package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.model.Logro;
import com.mathgo.mathgo.repository.LogroRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Logros", description = "Logros disponibles")
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/logros")
public class LogroController {

    private final LogroRepository logroRepository;

    public LogroController(LogroRepository logroRepository) {
        this.logroRepository = logroRepository;
    }

    @GetMapping
    public List<Logro> obtenerTodos() {
        return logroRepository.findAll();
    }
}