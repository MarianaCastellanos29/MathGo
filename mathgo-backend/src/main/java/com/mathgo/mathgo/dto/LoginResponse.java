package com.mathgo.mathgo.dto;

public class LoginResponse {
    private String token;
    private Long usuarioId;
    private String nombre;
    private String rol;
    private int vidas;
    private int nivelActual;
    private int xp;
    private String rango;
    private int rachaActual;

    public LoginResponse(String token, Long usuarioId, String nombre, String rol,
                         int vidas, int nivelActual, int xp, String rango, int rachaActual) {
        this.token       = token;
        this.usuarioId   = usuarioId;
        this.nombre      = nombre;
        this.rol         = rol;
        this.vidas       = vidas;
        this.nivelActual = nivelActual;
        this.xp          = xp;
        this.rango       = rango;
        this.rachaActual = rachaActual;
    }

    public String getToken()    { return token; }
    public Long getUsuarioId()  { return usuarioId; }
    public String getNombre()   { return nombre; }
    public String getRol()      { return rol; }
    public int getVidas()       { return vidas; }
    public int getNivelActual() { return nivelActual; }
    public int getXp()          { return xp; }
    public String getRango()    { return rango; }
    public int getRachaActual() { return rachaActual; }
}