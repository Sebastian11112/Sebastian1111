document.addEventListener('DOMContentLoaded', function() {
    const grupo = localStorage.getItem('grupo');
    const integrantes = localStorage.getItem('integrantes');
    const cantidad = localStorage.getItem('cantidad');
    const puntos = localStorage.getItem('puntos');
    const tiempoTotal = calcularTiempoTotal();
    
    const marcadorDiv = document.getElementById('marcador');
    marcadorDiv.innerHTML = `
        <p>Grupo: ${grupo}</p>
        <p>Integrantes: ${integrantes}</p>
        <p>Cantidad de Integrantes: ${cantidad}</p>
        <p>Puntos: ${puntos}</p>
        <p>Tiempo Total: ${tiempoTotal}</p>
    `;

    document.getElementById('intentarDeNuevo').addEventListener('click', function() {
        localStorage.removeItem('puntos');
        localStorage.removeItem('tiempoInicio');
        for (let i = 1; i <= 6; i++) {
            localStorage.removeItem(`tiempoRestanteNivel${i}`);
        }
        window.location.href = 'niveles/nivel1.html';
    });

    document.getElementById('iniciarSesion').addEventListener('click', function() {
        localStorage.clear();
        window.location.href = 'login.html';
    });
});

function calcularTiempoTotal() {
    const tiempoInicio = parseInt(localStorage.getItem('tiempoInicio'));
    const tiempoFin = new Date().getTime();
    const tiempoTotal = new Date(tiempoFin - tiempoInicio);

    const horas = tiempoTotal.getUTCHours();
    const minutos = tiempoTotal.getUTCMinutes();
    const segundos = tiempoTotal.getUTCSeconds();

    return `${horas}:${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}