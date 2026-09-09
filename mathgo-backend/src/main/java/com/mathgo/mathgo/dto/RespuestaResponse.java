package com.mathgo.mathgo.dto;

public class RespuestaResponse {
    private boolean correcto;
    private String mensaje;
    private int vidas;

    public RespuestaResponse(boolean correcto, String mensaje, int vidas) {
        this.correcto = correcto;
        this.mensaje = mensaje;
        this.vidas = vidas;
    }

    public boolean isCorrecto() { return correcto; }
    public String getMensaje() { return mensaje; }
    public int getVidas() { return vidas; }
}