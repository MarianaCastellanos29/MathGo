// ===== UsuarioRepository.java =====
package com.mathgo.mathgo.repository;
import com.mathgo.mathgo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByCorreo(String correo);
}
