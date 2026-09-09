package com.mathgo.mathgo.repository;

import com.mathgo.mathgo.model.UsuarioLogro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsuarioLogroRepository extends JpaRepository<UsuarioLogro, Long> {
    List<UsuarioLogro> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioIdAndLogroId(Long usuarioId, Long logroId);
}