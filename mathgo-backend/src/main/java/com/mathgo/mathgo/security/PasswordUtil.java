package com.mathgo.mathgo.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    private PasswordUtil() {}

    public static String encriptar(String passwordPlana) {
        return ENCODER.encode(passwordPlana);
    }

    public static boolean esHash(String valor) {
        return valor != null && valor.startsWith("$2");
    }

    /** Compara la contraseña ingresada con la guardada (hash BCrypt o texto plano antiguo). */
    public static boolean coincide(String ingresada, String guardada) {
        if (ingresada == null || guardada == null || guardada.isBlank()) {
            return false;
        }
        if (esHash(guardada)) {
            return ENCODER.matches(ingresada, guardada);
        }
        return guardada.equals(ingresada);
    }
}
