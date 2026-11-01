package com.mathgo.mathgo.model;

import jakarta.persistence.*;

/** Progreso de un alumno en un grado: cuántos de sus 3 niveles ya completó. */
@Entity
@Table(name = "progreso_grado",
       uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "grado"}))
public class ProgresoGrado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "grado", nullable = false)
    private int grado;

    @Column(name = "niveles_completados", nullable = false)
    private int nivelesCompletados;

    public ProgresoGrado() {}

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public int getGrado() { return grado; }
    public int getNivelesCompletados() { return nivelesCompletados; }

    public void setId(Long id) { this.id = id; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public void setGrado(int grado) { this.grado = grado; }
    public void setNivelesCompletados(int nivelesCompletados) { this.nivelesCompletados = nivelesCompletados; }
}
