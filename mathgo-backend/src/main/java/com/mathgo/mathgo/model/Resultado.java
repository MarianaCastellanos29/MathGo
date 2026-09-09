package com.mathgo.mathgo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resultados")
public class Resultado {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String pregunta;
    private int nivel;
    private boolean correcto;
    private LocalDateTime fechaRespuesta = LocalDateTime.now();

    public Resultado() {}

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public String getPregunta() { return pregunta; }
    public int getNivel() { return nivel; }
    public boolean isCorrecto() { return correcto; }
    public LocalDateTime getFechaRespuesta() { return fechaRespuesta; }

    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public void setPregunta(String pregunta) { this.pregunta = pregunta; }
    public void setNivel(int nivel) { this.nivel = nivel; }
    public void setCorrecto(boolean correcto) { this.correcto = correcto; }
    public void setFechaRespuesta(LocalDateTime f) { this.fechaRespuesta = f; }
}