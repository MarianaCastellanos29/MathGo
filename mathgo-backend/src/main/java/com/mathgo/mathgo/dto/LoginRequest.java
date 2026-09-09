package com.mathgo.mathgo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class LoginRequest {

    @Schema(example = "lilo@gmail.com")
    private String correo;

    @Schema(example = "123456")
    private String password;

    public String getCorreo() { return correo; }
    public String getPassword() { return password; }
    public void setCorreo(String correo) { this.correo = correo; }
    public void setPassword(String password) { this.password = password; }
}