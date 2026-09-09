package com.mathgo.mathgo.repository;
import com.mathgo.mathgo.model.Ejercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EjercicioRepository extends JpaRepository<Ejercicio, Long> {
    List<Ejercicio> findByNivel(int nivel);
}
