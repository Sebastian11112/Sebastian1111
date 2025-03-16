document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('cuestionarioCompletado')) {
        alert('Ya has completado el cuestionario. No puedes repetirlo.');
        window.location.href = '../marcador.html';
        return;
    }

    const puntos = localStorage.getItem('puntos') || 0;
    document.getElementById('puntos').innerText = `Tienes ${puntos} puntos`;

    const nivel = window.location.pathname.match(/nivel(\d)\.html/)[1];
    const form = document.getElementById(`respuestaForm${nivel}`);
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        verificarRespuesta(nivel);
    });

    iniciarTemporizador(10 * 60, document.getElementById('tiempo'), nivel);

    // Deshabilitar el botón de retroceso del navegador
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const grupo = document.getElementById('grupo').value;
    const integrantes = document.getElementById('integrantes').value;
    const cantidad = document.getElementById('cantidad').value;
    const clave = document.getElementById('clave').value;
    
    const claveCorrecta = "miClaveSecreta"; // Define aquí la clave correcta

    if (clave === claveCorrecta) {
        localStorage.setItem('grupo', grupo);
        localStorage.setItem('integrantes', integrantes);
        localStorage.setItem('cantidad', cantidad);
        localStorage.setItem('puntos', 0);
        localStorage.setItem('tiempoInicio', new Date().getTime());
        
        window.location.href = 'marcador.html';
    } else {
        alert('Clave incorrecta. Intenta nuevamente.');
    }
});

function verificarRespuesta(nivel) {
    const respuestasCorrectas = {
        1: "La calidad del software es el grado en que un sistema, componente o proceso cumple con los requisitos especificados y las expectativas del cliente.",
        2: "Algunas métricas comunes de calidad del software incluyen la cobertura de pruebas, la densidad de defectos, el tiempo medio de resolución de defectos y la satisfacción del cliente.",
        3: "La IA puede mejorar la calidad del software mediante la automatización de pruebas, la detección de defectos, la predicción de fallos y la optimización del rendimiento.",
        4: "Los métodos para evaluar la calidad del software incluyen revisiones de código, pruebas unitarias, pruebas de integración, pruebas de sistema y pruebas de aceptación.",
        5: "Algunas herramientas utilizadas para asegurar la calidad del software son JIRA, Selenium, JUnit, SonarQube y Jenkins.",
        6: "Las tendencias futuras en la calidad del software incluyen el uso de la IA para pruebas automatizadas, la integración continua y la entrega continua, y el enfoque en la experiencia del usuario."
    };
    const respuestaUsuario = document.getElementById(`respuesta${nivel}`).value.trim();
    if (respuestaUsuario.toLowerCase() === respuestasCorrectas[nivel].toLowerCase()) {
        completarNivel(nivel);
    } else {
        alert('Respuesta incorrecta. Intenta nuevamente.');
    }
}

function completarNivel(nivel) {
    let puntos = parseInt(localStorage.getItem('puntos')) || 0;
    const tiempoRestante = parseInt(localStorage.getItem(`tiempoRestanteNivel${nivel}`));
    const tiempoUsado = 10 * 60 - tiempoRestante;
    const puntosPerdidos = Math.floor(tiempoUsado / 60);
    puntos += 10 - puntosPerdidos; // Asignar puntos por completar el nivel y restar puntos por tiempo usado
    localStorage.setItem('puntos', puntos);
    alert(`Nivel ${nivel} completado. Tienes ${puntos} puntos.`);
    if (nivel < 6) {
        window.location.href = `nivel${parseInt(nivel) + 1}.html`;
    } else {
        mostrarEstadisticas();
    }
}

function iniciarTemporizador(duracion, display, nivel) {
    let tiempoRestante = duracion;
    localStorage.setItem(`tiempoRestanteNivel${nivel}`, tiempoRestante);
    const temporizador = setInterval(function() {
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;
        display.textContent = `Tiempo restante: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
        localStorage.setItem(`tiempoRestanteNivel${nivel}`, tiempoRestante);
        if (--tiempoRestante < 0) {
            clearInterval(temporizador);
            alert('Se acabó el tiempo. Intenta nuevamente.');
            window.location.href = `nivel${nivel}.html`;
        }
    }, 1000);
}

function mostrarEstadisticas() {
    const tiempoTotal = calcularTiempoTotal();
    const puntos = localStorage.getItem('puntos');
    alert(`¡Has completado todos los niveles!\nPuntos: ${puntos}\nTiempo total: ${tiempoTotal}`);
    localStorage.setItem('cuestionarioCompletado', true);
    window.location.href = '../marcador.html';
}

function calcularTiempoTotal() {
    const tiempoInicio = parseInt(localStorage.getItem('tiempoInicio'));
    const tiempoFin = new Date().getTime();
    const tiempoTotal = new Date(tiempoFin - tiempoInicio);

    const horas = tiempoTotal.getUTCHours();
    const minutos = tiempoTotal.getUTCMinutes();
    const segundos = tiempoTotal.getUTCSeconds();

    return `${horas}:${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}