package com.mathgo.mathgo.service;

import com.mathgo.mathgo.dto.RespuestaResponse;
import com.mathgo.mathgo.model.Ejercicio;
import com.mathgo.mathgo.model.Resultado;
import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.EjercicioRepository;
import com.mathgo.mathgo.repository.ResultadoRepository;
import com.mathgo.mathgo.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EjercicioService {

    private static final int NIVEL_MAXIMO = 3;

    private final EjercicioRepository ejercicioRepository;
    private final ResultadoRepository resultadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LogroService logroService;

    public EjercicioService(EjercicioRepository ejercicioRepository,
                            ResultadoRepository resultadoRepository,
                            UsuarioRepository usuarioRepository,
                            LogroService logroService) {
        this.ejercicioRepository = ejercicioRepository;
        this.resultadoRepository = resultadoRepository;
        this.usuarioRepository = usuarioRepository;
        this.logroService = logroService;
    }

    public List<Ejercicio> obtenerEjercicios() {
        return ejercicioRepository.findAll();
    }

    public List<Ejercicio> obtenerEjerciciosPorNivelUsuario(Long usuarioId, String nivelStr) {
        int nivel = Integer.parseInt(nivelStr);

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getGrado() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El estudiante aún no ha seleccionado su grado");
        }

        return ejercicioRepository.findByGradoAndNivel(usuario.getGrado(), nivel);
    }

    public RespuestaResponse responder(Long usuarioId, Long ejercicioId, String respuesta) {
        Ejercicio ejercicio = ejercicioRepository.findById(ejercicioId)
                .orElseThrow(() -> new RuntimeException("Ejercicio no encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        boolean correcto = ejercicio.getRespuestaCorrecta()
                .trim().equalsIgnoreCase(respuesta.trim());

        Resultado res = new Resultado();
        res.setUsuario(usuario);
        res.setPregunta(ejercicio.getPregunta());
        res.setNivel(ejercicio.getNivel());
        res.setGrado(ejercicio.getGrado());
        res.setCorrecto(correcto);
        resultadoRepository.save(res);

        if (correcto) {
            usuario.setRachaActual(usuario.getRachaActual() + 1);
            if (usuario.getRachaActual() > usuario.getMejorRacha()) {
                usuario.setMejorRacha(usuario.getRachaActual());
            }
            int xpGanado = 10 + (usuario.getRachaActual() >= 5 ? 5 : 0);
            usuario.setXp(usuario.getXp() + xpGanado);
            usuario.setRango(logroService.calcularRango(usuario.getXp()));

            int nivelActual = usuario.getNivelActual();
            Integer grado = usuario.getGrado();

            if (grado != null) {
                long totalDelNivel = ejercicioRepository.findByGradoAndNivel(grado, nivelActual).size();
                long correctosDelNivel = resultadoRepository
                        .contarCorrectosPorGradoYNivel(usuarioId, grado, nivelActual);

                if (totalDelNivel > 0 && correctosDelNivel >= totalDelNivel && nivelActual < NIVEL_MAXIMO) {
                    usuario.setNivelActual(nivelActual + 1);
                }
            }
        } else {
            usuario.setRachaActual(0);
            usuario.setVidas(Math.max(usuario.getVidas() - 1, 0));
        }

        usuarioRepository.save(usuario);
        logroService.verificarLogros(usuario);

        String mensaje = correcto
                ? "Correcto! " + ejercicio.getExplicacion() + " | Racha: " + usuario.getRachaActual() + " | XP: " + usuario.getXp()
                : "Incorrecto. La respuesta era: " + ejercicio.getRespuestaCorrecta() + ". " + ejercicio.getExplicacion();

        return new RespuestaResponse(correcto, mensaje, usuario.getVidas());
    }
}
