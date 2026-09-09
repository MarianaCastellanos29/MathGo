package com.mathgo.mathgo.security;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    @Test
    void generarToken_debeRetornarTokenNoNulo() {
        String token = JwtUtil.generarToken("test@gmail.com");
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extraerCorreo_debeRetornarCorreoCorrecto() {
        String correo = "lilo@gmail.com";
        String token = JwtUtil.generarToken(correo);
        assertEquals(correo, JwtUtil.extraerCorreo(token));
    }

    @Test
    void validarToken_tokenValido_debeRetornarTrue() {
        String token = JwtUtil.generarToken("test@gmail.com");
        assertTrue(JwtUtil.validarToken(token));
    }

    @Test
    void validarToken_tokenInvalido_debeRetornarFalse() {
        assertFalse(JwtUtil.validarToken("token.invalido.aqui"));
    }

    @Test
    void generarToken_dosTokens_paraMismoCorreo() {
        String t1 = JwtUtil.generarToken("a@gmail.com");
        String t2 = JwtUtil.generarToken("a@gmail.com");
        assertNotNull(t1);
        assertNotNull(t2);
    }
}