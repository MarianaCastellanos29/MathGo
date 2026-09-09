package com.mathgo.mathgo.dto;

public class RegistroRequest {
    private String nombre;
    private String correo;
    private String password;
    private String rol;

    public String getNombre()   { return nombre; }
    public String getCorreo()   { return correo; }
    public String getPassword() { return password; }
    public String getRol()      { return rol; }

    public void setNombre(String nombre)     { this.nombre = nombre; }
    public void setCorreo(String correo)     { this.correo = correo; }
    public void setPassword(String password) { this.password = password; }
    public void setRol(String rol)           { this.rol = rol; }
}