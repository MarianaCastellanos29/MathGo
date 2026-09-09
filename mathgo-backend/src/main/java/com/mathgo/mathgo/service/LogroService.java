package com.mathgo.mathgo.service;

import com.mathgo.mathgo.model.*;
import com.mathgo.mathgo.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogroService {

    private final LogroRepository logroRepository;
    private final UsuarioLogroRepository usuarioLogroRepository;
    private final ResultadoRepository resultadoRepository;

    public LogroService(LogroRepository logroRepository,
                        UsuarioLogroRepository usuarioLogroRepository,
                        ResultadoRepository resultadoRepository) {
        this.logroRepository = logroRepository;
        this.usuarioLogroRepository = usuarioLogroRepository;
        this.resultadoRepository = resultadoRepository;
    }

    public String calcularRango(int xp) {
        if (xp >= 500) return "Genio";
        if (xp >= 200) return "Matematico";
        if (xp >= 80)  return "Estudiante";
        return "Aprendiz";
    }

    public List<UsuarioLogro> verificarLogros(Usuario usuario) {
        int totalEjercicios = resultadoRepository.findByUsuarioIdAndCorrectoTrue(usuario.getId()).size();

        otorgarSiAplica(usuario, "RACHA", usuario.getMejorRacha());
        otorgarSiAplica(usuario, "XP", usuario.getXp());
        otorgarSiAplica(usuario, "EJERCICIOS", totalEjercicios);
        otorgarSiAplica(usuario, "NIVEL", usuario.getNivelActual());

        return usuarioLogroRepository.findByUsuarioId(usuario.getId());
    }

    private void otorgarSiAplica(Usuario usuario, String tipo, int valor) {
        List<Logro> logrosAplican = logroRepository
            .findByTipoAndValorRequeridoLessThanEqual(tipo, valor);
        for (Logro logro : logrosAplican) {
            boolean yaLoTiene = usuarioLogroRepository
                .existsByUsuarioIdAndLogroId(usuario.getId(), logro.getId());
            if (!yaLoTiene) {
                UsuarioLogro ul = new UsuarioLogro();
                ul.setUsuario(usuario);
                ul.setLogro(logro);
                usuarioLogroRepository.save(ul);
            }
        }
    }

    public List<UsuarioLogro> obtenerLogrosDeUsuario(Long usuarioId) {
        return usuarioLogroRepository.findByUsuarioId(usuarioId);
    }
}