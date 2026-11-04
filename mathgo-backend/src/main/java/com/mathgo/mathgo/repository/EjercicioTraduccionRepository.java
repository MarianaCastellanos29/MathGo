package com.mathgo.mathgo.repository;

import com.mathgo.mathgo.model.EjercicioTraduccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface EjercicioTraduccionRepository extends JpaRepository<EjercicioTraduccion, Long> {

    List<EjercicioTraduccion> findByEjercicioIdInAndIdioma(Collection<Long> ejercicioIds, String idioma);
}
