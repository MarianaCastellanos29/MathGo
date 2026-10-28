package com.mathgo.mathgo.config;

import com.mathgo.mathgo.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Sin token valido -> 401 (el frontend lo usa para mandar al login).
            // Con token pero sin permiso -> 403. Se responde con setStatus (no sendError)
            // para que Spring Boot no redirija a /error y cambie el codigo.
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                .accessDeniedHandler((request, response, accessDeniedException) ->
                    response.setStatus(HttpStatus.FORBIDDEN.value())))
            .authorizeHttpRequests(auth -> auth
                // Preflight de CORS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Pagina interna de errores de Spring Boot. Si no es publica, un 403 o un 400
                // se convierte en 401 al redirigirse a /error sin token.
                .requestMatchers("/error").permitAll()

                // Publico: registro y logins
                .requestMatchers(HttpMethod.POST,
                    "/usuarios/registro",
                    "/usuarios/login",
                    "/usuarios/login-nino"
                ).permitAll()

                // Publico: documentacion
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()

                // Solo padres y administradores
                .requestMatchers(HttpMethod.GET,
                    "/usuarios",
                    "/usuarios/alumnos",
                    "/usuarios/buscar"
                ).hasAnyRole("PADRE", "ADMIN")
                .requestMatchers(HttpMethod.POST,
                    "/usuarios/*/mensaje"
                ).hasAnyRole("PADRE", "ADMIN")

                // Todo lo demas requiere un token valido
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
