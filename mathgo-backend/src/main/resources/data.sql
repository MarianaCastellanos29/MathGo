-- ============================================================
-- MathGo - Script de base de datos
-- ============================================================

CREATE DATABASE IF NOT EXISTS mathgo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mathgo_db;

-- ============================================================
-- EJERCICIOS NIVEL 1 - Basico (sumas y restas simples)
-- ============================================================
INSERT IGNORE INTO ejercicios (id, pregunta, opcion_a, opcion_b, opcion_c, respuesta_correcta, explicacion, nivel) VALUES
(1,  '¿Cuanto es 3 + 4?',  '6',  '7',  '8',  'B', '3+4=7', 1),
(2,  '¿Cuanto es 10 - 3?', '6',  '8',  '7',  'C', '10-3=7', 1),
(3,  '¿Cuanto es 5 + 5?',  '9',  '10', '11', 'B', '5+5=10', 1),
(4,  '¿Cuanto es 8 - 2?',  '5',  '6',  '7',  'B', '8-2=6', 1),
(5,  '¿Cuanto es 6 + 3?',  '8',  '9',  '10', 'B', '6+3=9', 1);

-- ============================================================
-- EJERCICIOS NIVEL 2 - Intermedio (multiplicacion y division)
-- ============================================================
INSERT IGNORE INTO ejercicios (id, pregunta, opcion_a, opcion_b, opcion_c, respuesta_correcta, explicacion, nivel) VALUES
(6,  '¿Cuanto es 4 x 3?',  '10', '12', '14', 'B', '4x3=12', 2),
(7,  '¿Cuanto es 15 / 3?', '4',  '5',  '6',  'B', '15/3=5', 2),
(8,  '¿Cuanto es 7 x 6?',  '36', '42', '48', 'B', '7x6=42', 2),
(9,  '¿Cuanto es 24 / 4?', '5',  '6',  '7',  'B', '24/4=6', 2),
(10, '¿Cuanto es 9 x 9?',  '72', '81', '90', 'B', '9x9=81', 2);

-- ============================================================
-- EJERCICIOS NIVEL 3 - Avanzado (fracciones y potencias)
-- ============================================================
INSERT IGNORE INTO ejercicios (id, pregunta, opcion_a, opcion_b, opcion_c, respuesta_correcta, explicacion, nivel) VALUES
(11, '¿Cuanto es 1/2 + 1/4?', '2/6', '3/4', '1/3', 'B', '2/4+1/4=3/4', 3),
(12, '¿Cuanto es 2²?',        '2',   '4',   '6',   'B', '2x2=4', 3),
(13, '¿Cuanto es 3/4 - 1/4?', '1/4', '2/4', '3/8', 'B', '3/4-1/4=2/4', 3),
(14, '¿Cuanto es 3³?',        '9',   '18',  '27',  'C', '3x3x3=27', 3),
(15, '¿Cuanto es 1/3 x 3?',   '1/9', '1',   '3',   'B', '(1/3)x3=1', 3);

-- ============================================================
-- LOGROS
-- ============================================================
INSERT IGNORE INTO logros (id, nombre, descripcion, icono, tipo, valor_requerido) VALUES
(1,  'Primera racha',    'Consigue una racha de 3 respuestas correctas',  '🔥',   'RACHA',      3),
(2,  'Racha de fuego',   'Consigue una racha de 5 respuestas correctas',  '🔥🔥', 'RACHA',      5),
(3,  'Imparable',        'Consigue una racha de 10 respuestas correctas', '⚡',   'RACHA',      10),
(4,  'Primeros pasos',   'Gana tus primeros 50 XP',                       '⭐',   'XP',         50),
(5,  'Estudiante',       'Gana 200 XP',                                   '📚',   'XP',         200),
(6,  'Genio matematico', 'Gana 500 XP',                                   '🏆',   'XP',         500),
(7,  'Ejercitado',       'Completa 10 ejercicios correctamente',          '✅',   'EJERCICIOS', 10),
(8,  'Experto',          'Completa 25 ejercicios correctamente',          '🎯',   'EJERCICIOS', 25),
(9,  'Nivel 2',          'Alcanza el nivel 2',                            '🥈',   'NIVEL',      2),
(10, 'Nivel 3',          'Alcanza el nivel 3',                            '🥇',   'NIVEL',      3);

-- ============================================================
-- USUARIOS DE EJEMPLO
-- ============================================================
INSERT IGNORE INTO usuarios (nombre, correo, password, rol, vidas, nivel_actual, racha_actual, mejor_racha, xp, rango) VALUES
('Administrador', 'admin@mathgo.com',   'admin123',  'ADMIN',  5, 1, 0, 0, 0, 'Aprendiz'),
('Padre Demo',    'padre@mathgo.com',   'padre123',  'PADRE',  5, 1, 0, 0, 0, 'Aprendiz'),
('Alumno Demo',   'alumno@mathgo.com',  'alumno123', 'ALUMNO', 5, 1, 0, 0, 0, 'Aprendiz');