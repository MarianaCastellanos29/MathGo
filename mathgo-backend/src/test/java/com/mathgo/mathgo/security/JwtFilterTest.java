package com.mathgo.mathgo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtFilterTest {

    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;
    @Mock private FilterChain filterChain;

    private JwtFilter jwtFilter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtFilter = new JwtFilter();
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilterInternal_sinHeader_debeDejarPasar() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);
        jwtFilter.doFilterInternal(request, response, filterChain);
        verify(filterChain, times(1)).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_conTokenValido_debeAutenticar() throws Exception {
        String token = JwtUtil.generarToken("lilo@gmail.com");
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        jwtFilter.doFilterInternal(request, response, filterChain);
        verify(filterChain, times(1)).doFilter(request, response);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("lilo@gmail.com", SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "Bearer token.invalido.aqui",
        "Basic dXNlcjpwYXNz",
        "InvalidHeader"
    })
    void doFilterInternal_headerInvalido_noDebeAutenticar(String header) throws Exception {
        when(request.getHeader("Authorization")).thenReturn(header);
        jwtFilter.doFilterInternal(request, response, filterChain);
        verify(filterChain, times(1)).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}