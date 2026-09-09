package com.mathgo.mathgo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    @Column(unique = true) private String correo;
    private String password;
    private String rol;
    private int vidas = 5;
    private int nivelActual = 1;
    private int rachaActual = 0;
    private int mejorRacha = 0;
    private int xp = 0;
    private String rango = "Aprendiz";
    @Column(length = 500)
    private String mensajePadre;

    public Usuario() {}

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getCorreo() { return correo; }
    public String getPassword() { return password; }
    public String getRol() { return rol; }
    public int getVidas() { return vidas; }
    public int getNivelActual() { return nivelActual; }
    public int getRachaActual() { return rachaActual; }
    public int getMejorRacha() { return mejorRacha; }
    public int getXp() { return xp; }
    public String getRango() { return rango; }
    public String getMensajePadre() { return mensajePadre; }

    public void setId(Long id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setCorreo(String correo) { this.correo = correo; }
    public void setPassword(String password) { this.password = password; }
    public void setRol(String rol) { this.rol = rol; }
    public void setVidas(int vidas) { this.vidas = vidas; }
    public void setNivelActual(int nivelActual) { this.nivelActual = nivelActual; }
    public void setRachaActual(int rachaActual) { this.rachaActual = rachaActual; }
    public void setMejorRacha(int mejorRacha) { this.mejorRacha = mejorRacha; }
    public void setXp(int xp) { this.xp = xp; }
    public void setRango(String rango) { this.rango = rango; }
    public void setMensajePadre(String mensajePadre) { this.mensajePadre = mensajePadre; }
}