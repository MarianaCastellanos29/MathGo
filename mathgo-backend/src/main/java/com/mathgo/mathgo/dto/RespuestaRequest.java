// ===== RespuestaRequest.java =====
package com.mathgo.mathgo.dto;
public class RespuestaRequest {
    private Long ejercicioId;
    private String respuesta;
    private Long usuarioId;

    public RespuestaRequest() {}
    public Long getEjercicioId() { return ejercicioId; }
    public String getRespuesta() { return respuesta; }
    public Long getUsuarioId() { return usuarioId; }
    public void setEjercicioId(Long ejercicioId) { this.ejercicioId = ejercicioId; }
    public void setRespuesta(String respuesta) { this.respuesta = respuesta; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}
