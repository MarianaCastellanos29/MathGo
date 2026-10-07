package com.mathgo.mathgo.dto;

public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String correo;
    private String rol;
    private int vidas;
    private int nivelActual;
    private int xp;
    private String rango;
    private int rachaActual;
    private String mensajePadre;
    private String avatar;
    private String itemsComprados;

    private UsuarioDTO() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final UsuarioDTO dto = new UsuarioDTO();

        public Builder id(Long id)                   { dto.id = id; return this; }
        public Builder nombre(String nombre)         { dto.nombre = nombre; return this; }
        public Builder correo(String correo)         { dto.correo = correo; return this; }
        public Builder rol(String rol)               { dto.rol = rol; return this; }
        public Builder vidas(int vidas)              { dto.vidas = vidas; return this; }
        public Builder nivelActual(int nivelActual)  { dto.nivelActual = nivelActual; return this; }
        public Builder xp(int xp)                   { dto.xp = xp; return this; }
        public Builder rango(String rango)           { dto.rango = rango; return this; }
        public Builder rachaActual(int rachaActual)  { dto.rachaActual = rachaActual; return this; }
        public Builder mensajePadre(String msg)      { dto.mensajePadre = msg; return this; }
        public Builder avatar(String avatar)         { dto.avatar = avatar; return this; }
        public Builder itemsComprados(String items)  { dto.itemsComprados = items; return this; }
        public UsuarioDTO build()                    { return dto; }
    }

    public Long getId()            { return id; }
    public String getNombre()      { return nombre; }
    public String getCorreo()      { return correo; }
    public String getRol()         { return rol; }
    public int getVidas()          { return vidas; }
    public int getNivelActual()    { return nivelActual; }
    public int getXp()             { return xp; }
    public String getRango()       { return rango; }
    public int getRachaActual()    { return rachaActual; }
    public String getMensajePadre(){ return mensajePadre; }
    public String getAvatar()      { return avatar; }
    public String getItemsComprados(){ return itemsComprados; }
}