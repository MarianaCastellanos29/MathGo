package com.mathgo.mathgo.model;

import jakarta.persistence.*;

/**
 * Traducción de un ejercicio a otro idioma (el español es el idioma original, guardado en "ejercicios").
 * La respuesta correcta, el nivel y el grado se toman del ejercicio original.
 */
@Entity
@Table(name = "ejercicios_traduccion",
       uniqueConstraints = @UniqueConstraint(columnNames = {"ejercicio_id", "idioma"}))
public class EjercicioTraduccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ejercicio_id", nullable = false)
    private Long ejercicioId;

    @Column(name = "idioma", nullable = false, length = 5)
    private String idioma;

    @Column(name = "pregunta")
    private String pregunta;

    @Column(name = "opcion_a")
    private String opcionA;

    @Column(name = "opcion_b")
    private String opcionB;

    @Column(name = "opcion_c")
    private String opcionC;

    @Column(name = "explicacion")
    private String explicacion;

    public EjercicioTraduccion() {}

    public Long getId() { return id; }
    public Long getEjercicioId() { return ejercicioId; }
    public String getIdioma() { return idioma; }
    public String getPregunta() { return pregunta; }
    public String getOpcionA() { return opcionA; }
    public String getOpcionB() { return opcionB; }
    public String getOpcionC() { return opcionC; }
    public String getExplicacion() { return explicacion; }

    public void setId(Long id) { this.id = id; }
    public void setEjercicioId(Long ejercicioId) { this.ejercicioId = ejercicioId; }
    public void setIdioma(String idioma) { this.idioma = idioma; }
    public void setPregunta(String pregunta) { this.pregunta = pregunta; }
    public void setOpcionA(String opcionA) { this.opcionA = opcionA; }
    public void setOpcionB(String opcionB) { this.opcionB = opcionB; }
    public void setOpcionC(String opcionC) { this.opcionC = opcionC; }
    public void setExplicacion(String explicacion) { this.explicacion = explicacion; }
}
