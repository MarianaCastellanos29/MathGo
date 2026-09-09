package com.mathgo.mathgo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ejercicios")
public class Ejercicio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String pregunta;
    private String opcionA;
    private String opcionB;
    private String opcionC;
    @Column(name = "respuesta_correcta") private String respuestaCorrecta;
    private String explicacion;
    private int nivel; // 1=Básico, 2=Intermedio, 3=Avanzado

    public Long getId() { return id; }
    public String getPregunta() { return pregunta; }
    public String getOpcionA() { return opcionA; }
    public String getOpcionB() { return opcionB; }
    public String getOpcionC() { return opcionC; }
    public String getRespuestaCorrecta() { return respuestaCorrecta; }
    public String getExplicacion() { return explicacion; }
    public int getNivel() { return nivel; }

    public void setId(Long id) { this.id = id; }
    public void setPregunta(String pregunta) { this.pregunta = pregunta; }
    public void setOpcionA(String opcionA) { this.opcionA = opcionA; }
    public void setOpcionB(String opcionB) { this.opcionB = opcionB; }
    public void setOpcionC(String opcionC) { this.opcionC = opcionC; }
    public void setRespuestaCorrecta(String respuestaCorrecta) { this.respuestaCorrecta = respuestaCorrecta; }
    public void setExplicacion(String explicacion) { this.explicacion = explicacion; }
    public void setNivel(int nivel) { this.nivel = nivel; }
}
