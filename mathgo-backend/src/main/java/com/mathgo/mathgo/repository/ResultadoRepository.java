package com.mathgo.mathgo.repository;

import com.mathgo.mathgo.model.Resultado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ResultadoRepository extends JpaRepository<Resultado, Long> {
    List<Resultado> findByUsuarioId(Long usuarioId);
    List<Resultado> findByUsuarioIdAndCorrectoTrue(Long usuarioId);
    List<Resultado> findByUsuarioIdOrderByFechaRespuestaDesc(Long usuarioId);
    long countByUsuarioIdAndCorrectoTrue(Long usuarioId);

    @Query("SELECT COUNT(r) FROM Resultado r WHERE r.usuario.id = :usuarioId AND r.nivel = :nivel AND r.correcto = true")
    long contarCorrectosPorNivel(@Param("usuarioId") Long usuarioId, @Param("nivel") int nivel);
}