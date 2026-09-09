package com.mathgo.mathgo.service;

import com.mathgo.mathgo.dto.ProgresoResponse;
import com.mathgo.mathgo.model.Resultado;
import com.mathgo.mathgo.repository.ResultadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgresoService {

    private final ResultadoRepository resultadoRepository;

    public ProgresoService(ResultadoRepository resultadoRepository) {
        this.resultadoRepository = resultadoRepository;
    }

    public ProgresoResponse obtenerProgreso(Long usuarioId) {
        List<Resultado> resultados = resultadoRepository.findByUsuarioId(usuarioId);
        int total = resultados.size();
        int correctos = (int) resultadoRepository.countByUsuarioIdAndCorrectoTrue(usuarioId);
        double porcentaje = total > 0 ? Math.round((correctos * 100.0 / total) * 10.0) / 10.0 : 0.0;
        return new ProgresoResponse(total, correctos, porcentaje);
    }
}