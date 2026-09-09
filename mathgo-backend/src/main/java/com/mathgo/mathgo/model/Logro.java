package com.mathgo.mathgo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "logros")
public class Logro {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String descripcion;
    private String icono;        // emoji o código de icono
    private String tipo;         // RACHA, XP, NIVEL, EJERCICIOS
    private int valorRequerido;  // cuánto se necesita para obtenerlo

    public Logro() {}

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public String getIcono() { return icono; }
    public String getTipo() { return tipo; }
    public int getValorRequerido() { return valorRequerido; }

    public void setId(Long id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setIcono(String icono) { this.icono = icono; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setValorRequerido(int valorRequerido) { this.valorRequerido = valorRequerido; }
}