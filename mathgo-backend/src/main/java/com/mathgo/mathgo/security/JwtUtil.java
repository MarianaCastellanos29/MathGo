package com.mathgo.mathgo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

public class JwtUtil {

    private static final Key KEY = construirClave();
    private static final long EXPIRATION = leerExpiracion();

    private static Key construirClave() {
        String secret = System.getenv("JWT_SECRET");
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            // Sin secreto valido (minimo 32 caracteres): clave aleatoria.
            // Los tokens se invalidan al reiniciar el backend.
            return Keys.secretKeyFor(SignatureAlgorithm.HS256);
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private static long leerExpiracion() {
        try {
            return Long.parseLong(System.getenv("JWT_EXPIRATION"));
        } catch (Exception e) {
            return 86400000L; // 24 horas
        }
    }

    public static String generarToken(String correo) {
        return generarToken(correo, null);
    }

    public static String generarToken(String correo, String rol) {
        JwtBuilder builder = Jwts.builder()
                .setSubject(correo)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION));
        if (rol != null) {
            builder.claim("rol", rol);
        }
        return builder.signWith(KEY).compact();
    }

    private static Claims claims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static String extraerCorreo(String token) {
        return claims(token).getSubject();
    }

    public static String extraerRol(String token) {
        return claims(token).get("rol", String.class);
    }

    public static boolean validarToken(String token) {
        try {
            claims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
