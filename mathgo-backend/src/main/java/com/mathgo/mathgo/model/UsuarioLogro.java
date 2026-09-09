package com.mathgo.mathgo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario_logros")
public class UsuarioLogro {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "usuario_id") private Usuario usuario;
    @ManyToOne @JoinColumn(name = "logro_id") private Logro logro;
    private LocalDateTime fechaObtenido = LocalDateTime.now();

    public UsuarioLogro() {}

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public Logro getLogro() { return logro; }
    public LocalDateTime getFechaObtenido() { return fechaObtenido; }

    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public void setLogro(Logro logro) { this.logro = logro; }
    public void setFechaObtenido(LocalDateTime fechaObtenido) { this.fechaObtenido = fechaObtenido; }
}