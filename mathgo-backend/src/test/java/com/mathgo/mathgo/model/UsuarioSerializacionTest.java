package com.mathgo.mathgo.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UsuarioSerializacionTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void alConvertirAJson_laPasswordNoDebeAparecer() throws Exception {
        Usuario u = new Usuario();
        u.setNombre("Juan");
        u.setCorreo("juan@gmail.com");
        u.setPassword("$2a$10$hashDePrueba");

        String json = mapper.writeValueAsString(u);

        assertFalse(json.contains("password"));
        assertFalse(json.contains("hashDePrueba"));
        assertTrue(json.contains("juan@gmail.com"));
    }

    @Test
    void alLeerJson_laPasswordSiSeAcepta() throws Exception {
        Usuario u = mapper.readValue(
                "{\"correo\":\"ana@gmail.com\",\"password\":\"secreta\"}", Usuario.class);

        assertEquals("secreta", u.getPassword());
    }
}
