package com.mathgo.mathgo.repository;

import com.mathgo.mathgo.model.Logro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogroRepository extends JpaRepository<Logro, Long> {
    List<Logro> findByTipoAndValorRequeridoLessThanEqual(String tipo, int valor);
}