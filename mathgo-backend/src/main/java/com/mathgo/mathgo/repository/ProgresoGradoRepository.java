package com.mathgo.mathgo.repository;

import com.mathgo.mathgo.model.ProgresoGrado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgresoGradoRepository extends JpaRepository<ProgresoGrado, Long> {

    Optional<ProgresoGrado> findByUsuarioIdAndGrado(Long usuarioId, int grado);
}
