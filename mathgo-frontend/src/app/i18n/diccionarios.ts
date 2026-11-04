/**
 * Diccionarios de traducción (i18n). La clave es un identificador; si una clave
 * no existe en el idioma activo se muestra tal cual el texto/clave original
 * (por eso el español de los niveles y temas no necesita entradas en ES).
 * Admite parámetros: "Hola {nombre}".
 */
export type Idioma = 'es' | 'en';
export type Diccionario = Record<string, string>;

export const ES: Diccionario = {
  'nav.inicio': 'Inicio', 'nav.progreso': 'Progreso', 'nav.logros': 'Logros', 'nav.tienda': 'Tienda',
  'nav.juegos': 'Juegos', 'nav.apoyo': 'Apoyo', 'nav.perfil': 'Perfil', 'nav.salir': 'Salir',
  'nav.principal': 'Principal', 'nav.miPerfil': 'Mi perfil', 'nav.irInicio': 'MathGo, inicio',
  'nav.cambiarIdioma': 'Cambiar idioma',

  'home.hola': '¡Hola', 'home.listo': '¿Listo para practicar? 🔥',
  'home.frase': 'Las matemáticas también son una gran aventura. ✨',
  'home.progresoGeneral': '📊 Tu progreso general', 'home.nivel': 'Nivel {n}',
  'home.vasBien': '¡Vas muy bien!', 'home.sigueAsi': '¡Sigue así, tú puedes!',
  'home.vidas': 'Tus vidas', 'home.recargar': '↻ Recargar vidas',
  'home.cambiarGrado': '↻ Cambiar grado', 'home.aventura': '🗺️ Tu aventura',
  'home.sub': 'Estos son los niveles de {grado}. ¡Termina uno para descubrir el siguiente!',
  'home.preparando': '⏳ Preparando tus niveles...',
  'home.cuentanos': 'Cuéntanos en qué grado estás para mostrarte tus niveles.',
  'home.elegirGrado': '🎒 Elegir mi grado',
  'home.jugar': '▶ ¡Jugar!', 'home.repetir': '↻ Repetir', 'home.sorpresa': '¡Sorpresa!',
  'home.terminaAnterior': 'Termina el nivel anterior para descubrirlo',
  'home.logros': '🏅 Mis logros', 'home.historial': '📋 Mi historial', 'home.tienda': '🏪 Tienda',
  'home.juegos': '🎲 Juegos', 'home.apoyo': '📚 Apoyo', 'home.padre': '👨‍👩‍👧 Panel Padre',

  'grado.1': 'Primer grado', 'grado.2': 'Segundo grado', 'grado.3': 'Tercer grado',
  'grado.4': 'Cuarto grado', 'grado.5': 'Quinto grado',
  'grado.nombre.1': 'Primero', 'grado.nombre.2': 'Segundo', 'grado.nombre.3': 'Tercero',
  'grado.nombre.4': 'Cuarto', 'grado.nombre.5': 'Quinto',
  'grado.titulo': '¿En qué grado estás?',
  'grado.sub': 'Elige tu grado y Pyro te prepara los niveles justo para ti',
  'grado.hola': '¡Hola! 👋', 'grado.bien': '¡Buena elección! 🎉',
  'grado.practicaras': 'En este grado vas a practicar', 'grado.vamos': '▶ ¡Vamos a jugar!',
  'grado.guardando': 'Guardando...',
  'grado.errorSesion': 'No encontramos tu sesión. Vuelve a iniciar sesión.',
  'grado.errorGuardar': 'Ups, no pudimos guardar tu grado. Intenta de nuevo.',

  'juegos.titulo': '🎲 Zona de juegos', 'juegos.sub': 'Elige un juego, {nombre}, y pon a prueba lo que has aprendido',
  'juegos.jugar': '▶ Jugar',
  'juegos.memorama': 'Memorama matemático', 'juegos.memoramaDesc': 'Encuentra la pareja entre cada operación y su resultado',
  'juegos.carrera': 'Carrera del dragón', 'juegos.carreraDesc': 'Responde rápido y ayuda a Pyro a llegar a la meta',

  'prog.titulo': '📊 Mi progreso', 'prog.sub': 'Tu historial de ejercicios y precisión',
  'prog.resueltos': 'Ejercicios resueltos', 'prog.correctas': 'Respuestas correctas',
  'prog.aciertos': 'Porcentaje de aciertos', 'prog.nivel': 'Nivel actual',
  'prog.precision': 'Precisión general', 'prog.verHistorial': '📋 Ver mi historial',
  'prog.cargando': '⏳ Cargando tu progreso...',

  'hist.titulo': '📋 Mi historial', 'hist.sub': 'Todos los ejercicios que has resuelto',
  'hist.correctas': 'Correctas', 'hist.incorrectas': 'Incorrectas', 'hist.precision': 'Precisión',
  'hist.pregunta': 'Pregunta', 'hist.nivel': 'Nivel', 'hist.resultado': 'Resultado', 'hist.fecha': 'Fecha',
  'hist.ok': '✅ Correcto', 'hist.mal': '❌ Incorrecto',
  'hist.vacio': 'Aún no has respondido ningún ejercicio.', 'hist.irJugar': '¡Ir a jugar!',

  'ej.preparando': 'Pyro está preparando los ejercicios...', 'ej.sinVidas': '¡Sin vidas!',
  'ej.sinVidasTxt': 'Pyro está triste... Ve a la tienda para conseguir más ❤️',
  'ej.inicio': '🏠 Inicio', 'ej.completado': '¡{tema} completado!',
  'ej.orgulloso': '🔥 Pyro está muy orgulloso de ti', 'ej.correctas': 'Correctas', 'ej.monedas': 'Monedas',
  'ej.vidas': 'Vidas', 'ej.sabias': '💡 ¿Sabías que...?', 'ej.siguienteNivel': '⚡ Siguiente nivel',
  'ej.volver': '🏠 Volver al inicio', 'ej.tuPuedes': '¡Tú puedes!', 'ej.fuego': '¡Fuego! 🔥', 'ej.animo': '¡Ánimo! 💪',
  'ej.correcto': '¡Correcto!', 'ej.incorrecto': 'Respuesta incorrecta',
  'ej.buscando': '⏳ Pyro está buscando algo interesante...', 'ej.pensando': '🐉 Pyro está pensando cómo explicarte...',
  'ej.espera': '⏳ Espera...', 'ej.terminar': '🏁 Terminar', 'ej.siguiente': 'Siguiente →',
  'ej.etiqueta': 'Nivel {nivel} — {tema} • {actual}/{total}', 'ej.salir': 'Salir del ejercicio',

  'idioma.es': 'Español', 'idioma.en': 'English'
};

export const EN: Diccionario = {
  'nav.inicio': 'Home', 'nav.progreso': 'Progress', 'nav.logros': 'Awards', 'nav.tienda': 'Shop',
  'nav.juegos': 'Games', 'nav.apoyo': 'Help', 'nav.perfil': 'Profile', 'nav.salir': 'Exit',
  'nav.principal': 'Main', 'nav.miPerfil': 'My profile', 'nav.irInicio': 'MathGo, home',
  'nav.cambiarIdioma': 'Change language',

  'home.hola': 'Hi', 'home.listo': 'Ready to practice? 🔥',
  'home.frase': 'Math is a great adventure too. ✨',
  'home.progresoGeneral': '📊 Your overall progress', 'home.nivel': 'Level {n}',
  'home.vasBien': "You're doing great!", 'home.sigueAsi': 'Keep it up, you can do it!',
  'home.vidas': 'Your lives', 'home.recargar': '↻ Refill lives',
  'home.cambiarGrado': '↻ Change grade', 'home.aventura': '🗺️ Your adventure',
  'home.sub': 'These are the {grado} levels. Finish one to unlock the next!',
  'home.preparando': '⏳ Getting your levels ready...',
  'home.cuentanos': 'Tell us your grade so we can show your levels.',
  'home.elegirGrado': '🎒 Choose my grade',
  'home.jugar': '▶ Play!', 'home.repetir': '↻ Replay', 'home.sorpresa': 'Surprise!',
  'home.terminaAnterior': 'Finish the previous level to unlock it',
  'home.logros': '🏅 My achievements', 'home.historial': '📋 My history', 'home.tienda': '🏪 Shop',
  'home.juegos': '🎲 Games', 'home.apoyo': '📚 Help', 'home.padre': '👨‍👩‍👧 Parent panel',

  'grado.1': 'First grade', 'grado.2': 'Second grade', 'grado.3': 'Third grade',
  'grado.4': 'Fourth grade', 'grado.5': 'Fifth grade',
  'grado.nombre.1': 'First', 'grado.nombre.2': 'Second', 'grado.nombre.3': 'Third',
  'grado.nombre.4': 'Fourth', 'grado.nombre.5': 'Fifth',
  'grado.titulo': 'What grade are you in?',
  'grado.sub': 'Pick your grade and Pyro will prepare the levels just for you',
  'grado.hola': 'Hello! 👋', 'grado.bien': 'Great choice! 🎉',
  'grado.practicaras': "In this grade you'll practice", 'grado.vamos': "▶ Let's play!",
  'grado.guardando': 'Saving...',
  'grado.errorSesion': "We couldn't find your session. Please log in again.",
  'grado.errorGuardar': "Oops, we couldn't save your grade. Try again.",

  'juegos.titulo': '🎲 Game zone', 'juegos.sub': 'Pick a game, {nombre}, and test what you have learned',
  'juegos.jugar': '▶ Play',
  'juegos.memorama': 'Math memory game', 'juegos.memoramaDesc': 'Match each operation with its result',
  'juegos.carrera': 'Dragon race', 'juegos.carreraDesc': 'Answer fast and help Pyro reach the finish line',

  'prog.titulo': '📊 My progress', 'prog.sub': 'Your exercise history and accuracy',
  'prog.resueltos': 'Exercises solved', 'prog.correctas': 'Correct answers',
  'prog.aciertos': 'Accuracy rate', 'prog.nivel': 'Current level',
  'prog.precision': 'Overall accuracy', 'prog.verHistorial': '📋 See my history',
  'prog.cargando': '⏳ Loading your progress...',

  'hist.titulo': '📋 My history', 'hist.sub': 'All the exercises you have solved',
  'hist.correctas': 'Correct', 'hist.incorrectas': 'Incorrect', 'hist.precision': 'Accuracy',
  'hist.pregunta': 'Question', 'hist.nivel': 'Level', 'hist.resultado': 'Result', 'hist.fecha': 'Date',
  'hist.ok': '✅ Correct', 'hist.mal': '❌ Incorrect',
  'hist.vacio': "You haven't answered any exercise yet.", 'hist.irJugar': 'Go play!',

  'ej.preparando': 'Pyro is getting the exercises ready...', 'ej.sinVidas': 'Out of lives!',
  'ej.sinVidasTxt': 'Pyro is sad... Go to the shop to get more ❤️',
  'ej.inicio': '🏠 Home', 'ej.completado': '{tema} completed!',
  'ej.orgulloso': '🔥 Pyro is so proud of you', 'ej.correctas': 'Correct', 'ej.monedas': 'Coins',
  'ej.vidas': 'Lives', 'ej.sabias': '💡 Did you know...?', 'ej.siguienteNivel': '⚡ Next level',
  'ej.volver': '🏠 Back to home', 'ej.tuPuedes': 'You can do it!', 'ej.fuego': 'On fire! 🔥', 'ej.animo': 'Keep going! 💪',
  'ej.correcto': 'Correct!', 'ej.incorrecto': 'Wrong answer',
  'ej.buscando': '⏳ Pyro is looking for something interesting...', 'ej.pensando': '🐉 Pyro is thinking how to explain...',
  'ej.espera': '⏳ Wait...', 'ej.terminar': '🏁 Finish', 'ej.siguiente': 'Next →',
  'ej.etiqueta': 'Level {nivel} — {tema} • {actual}/{total}', 'ej.salir': 'Leave the exercise',

  'idioma.es': 'Español', 'idioma.en': 'English',

  // Temas y descripciones de los niveles (la clave es el texto original en español)
  'Sumas': 'Addition', 'Restas': 'Subtraction', 'Sumas y restas': 'Addition and subtraction',
  'Sumas grandes': 'Big sums', 'Restas grandes': 'Big subtractions', 'Multiplicación': 'Multiplication',
  'División': 'Division', 'Problemas': 'Word problems', 'Multiplicación grande': 'Big multiplication',
  'Fracciones': 'Fractions', 'División y problemas': 'Division and problems', 'Decimales': 'Decimals',
  'Porcentajes': 'Percentages', 'Geometría': 'Geometry',
  'Suma hasta 10': 'Add up to 10', 'Resta hasta 10': 'Subtract up to 10', 'Con números hasta 20': 'With numbers up to 20',
  'Sumas de dos cifras': 'Two-digit sums', 'Restas de dos cifras': 'Two-digit subtractions',
  'Las primeras tablas': 'The first times tables', 'Tablas del 4 al 9': 'Times tables from 4 to 9',
  'Reparte en partes iguales': 'Share into equal parts', 'Historias con operaciones': 'Stories with operations',
  'Números más grandes': 'Bigger numbers', 'Sumas, restas y comparación': 'Adding, subtracting and comparing',
  'Divide y resuelve': 'Divide and solve', 'Operaciones con comas': 'Operations with decimals',
  'El 10%, el 25%, el 50%': '10%, 25%, 50%', 'Área y perímetro': 'Area and perimeter'
};
