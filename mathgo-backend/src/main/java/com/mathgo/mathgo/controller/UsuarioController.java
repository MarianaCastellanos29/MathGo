package com.mathgo.mathgo.controller;

import com.mathgo.mathgo.dto.LoginRequest;
import com.mathgo.mathgo.dto.LoginResponse;
import com.mathgo.mathgo.dto.RegistroRequest;
import com.mathgo.mathgo.dto.UsuarioDTO;
import com.mathgo.mathgo.model.Resultado;
import com.mathgo.mathgo.model.Usuario;
import com.mathgo.mathgo.repository.ResultadoRepository;
import com.mathgo.mathgo.repository.UsuarioRepository;
import com.mathgo.mathgo.security.JwtUtil;
import com.mathgo.mathgo.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "Usuarios", description = "Registro, login y gestión de usuarios")
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final ResultadoRepository resultadoRepository;

    public UsuarioController(UsuarioService usuarioService,
                             UsuarioRepository usuarioRepository,
                             ResultadoRepository resultadoRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.resultadoRepository = resultadoRepository;
    }

    private UsuarioDTO toDTO(Usuario u) {
        return UsuarioDTO.builder()
            .id(u.getId())
            .nombre(u.getNombre())
            .correo(u.getCorreo())
            .rol(u.getRol())
            .vidas(u.getVidas())
            .nivelActual(u.getNivelActual())
            .xp(u.getXp())
            .rango(u.getRango())
            .rachaActual(u.getRachaActual())
            .mensajePadre(u.getMensajePadre())
            .avatar(u.getAvatar())
            .itemsComprados(u.getItemsComprados())
            .build();
    }

    @Operation(summary = "Registrar nuevo usuario")
    @PostMapping("/registro")
    public ResponseEntity<UsuarioDTO> registrar(@RequestBody RegistroRequest req) {
        Usuario usuario = new Usuario();
        usuario.setNombre(req.getNombre());
        usuario.setCorreo(req.getCorreo());
        usuario.setPassword(req.getPassword());
        usuario.setRol(req.getRol());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toDTO(usuarioService.registrarUsuario(usuario)));
    }

    @Operation(summary = "Iniciar sesión y obtener JWT")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Usuario u = usuarioRepository.findByCorreo(req.getCorreo());
        if (u == null || !u.getPassword().equals(req.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales incorrectas");
        }
        String token = JwtUtil.generarToken(u.getCorreo());
        return ResponseEntity.ok(new LoginResponse(
                token, u.getId(), u.getNombre(), u.getRol(),
                u.getVidas(), u.getNivelActual(), u.getXp(),
                u.getRango(), u.getRachaActual(),
                u.getAvatar(), u.getItemsComprados()
        ));
    }

    @Operation(summary = "Listar todos los usuarios")
    @GetMapping
    public List<UsuarioDTO> listar() {
        return usuarioRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Operation(summary = "Obtener usuario por ID")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtener(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(u -> ResponseEntity.ok(toDTO(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Buscar alumno por nombre")
    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(@RequestParam String nombre) {
        List<UsuarioDTO> resultados = usuarioRepository.findAll()
                .stream()
                .filter(u -> "ALUMNO".equalsIgnoreCase(u.getRol())
                        && u.getNombre().toLowerCase().contains(nombre.toLowerCase()))
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(resultados);
    }

    @Operation(summary = "Obtener alumnos")
    @GetMapping("/alumnos")
    public List<UsuarioDTO> obtenerAlumnos() {
        return usuarioRepository.findAll()
                .stream()
                .filter(u -> "ALUMNO".equalsIgnoreCase(u.getRol()))
                .map(this::toDTO)
                .toList();
    }

    @Operation(summary = "Dar vidas extra a un alumno")
    @PostMapping("/{id}/dar-vidas")
    public ResponseEntity<?> darVidas(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        return usuarioRepository.findById(id).map(u -> {
            int vidasExtra = body.getOrDefault("vidas", 5);
            u.setVidas(Math.min(u.getVidas() + vidasExtra, 5));
            usuarioRepository.save(u);
            return ResponseEntity.ok(Map.of("vidas", u.getVidas(), "mensaje", "Vidas actualizadas"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Guardar el progreso del alumno (nivel, vidas, xp, avatar, avatares comprados)")
    @PutMapping("/{id}/progreso")
    public ResponseEntity<?> guardarProgreso(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return usuarioRepository.findById(id).map(u -> {
            if (body.containsKey("vidas")) u.setVidas(((Number) body.get("vidas")).intValue());
            if (body.containsKey("nivelActual")) u.setNivelActual(((Number) body.get("nivelActual")).intValue());
            if (body.containsKey("xp")) u.setXp(((Number) body.get("xp")).intValue());
            if (body.containsKey("rango")) u.setRango((String) body.get("rango"));
            if (body.containsKey("rachaActual")) u.setRachaActual(((Number) body.get("rachaActual")).intValue());
            if (body.containsKey("mejorRacha")) u.setMejorRacha(((Number) body.get("mejorRacha")).intValue());
            if (body.containsKey("avatar")) u.setAvatar((String) body.get("avatar"));
            if (body.containsKey("itemsComprados")) u.setItemsComprados((String) body.get("itemsComprados"));
            usuarioRepository.save(u);
            return ResponseEntity.ok(toDTO(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Enviar mensaje de motivacion a un alumno")
    @PostMapping("/{id}/mensaje")
    public ResponseEntity<?> enviarMensaje(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return usuarioRepository.findById(id).map(u -> {
            u.setMensajePadre(body.getOrDefault("mensaje", ""));
            usuarioRepository.save(u);
            return ResponseEntity.ok(Map.of("ok", true));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Obtener mensaje del padre para el alumno")
    @GetMapping("/{id}/mensaje")
    public ResponseEntity<?> obtenerMensaje(@PathVariable Long id) {
        return usuarioRepository.findById(id).map(u -> {
            String msg = u.getMensajePadre();
            u.setMensajePadre(null);
            usuarioRepository.save(u);
            return ResponseEntity.ok(Map.of("mensaje", msg != null ? msg : ""));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Reporte semanal de un alumno")
    @GetMapping("/{id}/reporte-semanal")
    public ResponseEntity<?> reporteSemanal(@PathVariable Long id) {
        LocalDateTime hace7dias = LocalDateTime.now().minusDays(7);
        List<Resultado> resultados = resultadoRepository
                .findByUsuarioIdOrderByFechaRespuestaDesc(id)
                .stream()
                .filter(r -> r.getFechaRespuesta().isAfter(hace7dias))
                .toList();

        long correctos = resultados.stream().filter(Resultado::isCorrecto).count();
        long incorrectos = resultados.size() - correctos;
        double porcentaje = resultados.isEmpty() ? 0 :
                Math.round((correctos * 100.0 / resultados.size()) * 10.0) / 10.0;

        Map<Integer, Long> porNivel = resultados.stream()
                .collect(Collectors.groupingBy(Resultado::getNivel, Collectors.counting()));

        return ResponseEntity.ok(Map.of(
                "total", resultados.size(),
                "correctos", correctos,
                "incorrectos", incorrectos,
                "porcentaje", porcentaje,
                "porNivel", porNivel
        ));
    }

    @Operation(summary = "Login del niño para panel padre")
    @PostMapping("/login-nino")
    public ResponseEntity<?> loginNino(@RequestBody LoginRequest req) {
        Usuario u = usuarioRepository.findByCorreo(req.getCorreo());
        if (u == null || !u.getPassword().equals(req.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales incorrectas");
        }
        if (!"ALUMNO".equalsIgnoreCase(u.getRol())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Solo se puede consultar alumnos");
        }
        return ResponseEntity.ok(toDTO(u));
    }
}