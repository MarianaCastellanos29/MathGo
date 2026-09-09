package com.mathgo.mathgo.dto;
public class ProgresoResponse {
    private int total;
    private int correctos;
    private double porcentaje;

    public ProgresoResponse(int total, int correctos, double porcentaje) {
        this.total = total;
        this.correctos = correctos;
        this.porcentaje = porcentaje;
    }
    public int getTotal() { return total; }
    public int getCorrectos() { return correctos; }
    public double getPorcentaje() { return porcentaje; }
}
