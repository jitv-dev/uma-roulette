const inputNombre = document.getElementById('inputNombre');
const botonAgregar = document.getElementById('botonAgregar');
const listaParticipantes = document.getElementById('listaParticipantes');
const seccionParticipantes = document.getElementById('seccionParticipantes');
const pistaCarreras = document.getElementById('pistaCarreras');
const botonIniciar = document.getElementById('botonIniciar');
const cuadroGanador = document.getElementById('cuadroGanador');
const botonTema = document.getElementById('botonTema');

let participantes = [];
let elementosCaballos = [];
let intervaloCarrera = null;
let ganadorActual = null;

const spritesDisponibles = [
    'caballo1.gif', 'caballo2.gif', 'caballo3.gif', 'caballo4.gif',
    'caballo5.gif', 'caballo6.gif', 'caballo7.gif', 'caballo8.gif'
];

// Mezclar sprites al cargar
let spritesRestantes = [...spritesDisponibles].sort(() => Math.random() - 0.5);

function obtenerSpriteUnico() {
    // Si no quedan sprites, volver a mezclar
    if (spritesRestantes.length === 0) {
        spritesRestantes = [...spritesDisponibles].sort(() => Math.random() - 0.5);
    }
    // Sacar el primero disponible
    return spritesRestantes.shift();
}

function agregarParticipante() {
    const nombre = inputNombre.value.trim();

    if (!nombre || participantes.length >= 8) {
        return;
    }

    participantes.push({
        id: Date.now(),
        nombre: nombre,
        sprite: obtenerSpriteUnico(),
        progreso: 0
    });

    inputNombre.value = '';
    actualizarLista();
    actualizarPista();

    botonIniciar.disabled = participantes.length < 2;
}

function actualizarLista() {
    if (participantes.length === 0) {
        seccionParticipantes.style.display = 'none';
        return;
    }

    seccionParticipantes.style.display = 'block';
    listaParticipantes.innerHTML = '';

    participantes.forEach(p => {
        const chip = document.createElement('span');
        chip.className = 'chip-participante';

        const nombreTexto = document.createElement('span');
        nombreTexto.textContent = p.nombre;

        const botonX = document.createElement('button');
        botonX.className = 'btn-eliminar-chip';
        botonX.innerHTML = '×';
        botonX.onclick = () => eliminarParticipante(p.id);

        chip.appendChild(nombreTexto);
        chip.appendChild(botonX);
        listaParticipantes.appendChild(chip);
    });
}

function eliminarParticipante(idParticipante) {
    const participante = participantes.find(p => p.id === idParticipante);

    if (participante) {
        // Devolver el sprite al pool
        spritesRestantes.push(participante.sprite);

        // Eliminar participante
        participantes = participantes.filter(p => p.id !== idParticipante);

        actualizarLista();
        actualizarPista();

        botonIniciar.disabled = participantes.length < 2;
    }
}

function actualizarPista() {
    if (participantes.length === 0) {
        pistaCarreras.style.display = 'none';
        return;
    }

    pistaCarreras.style.display = 'block';
    pistaCarreras.innerHTML = '';
    elementosCaballos = [];

    participantes.forEach(p => {
        const carril = document.createElement('div');
        carril.className = 'carril';

        const corredor = document.createElement('div');
        corredor.className = 'corredor';

        const imagen = document.createElement('img');
        imagen.src = `horses/${p.sprite}`;
        imagen.alt = p.nombre;

        corredor.appendChild(imagen);

        const nombre = document.createElement('div');
        nombre.className = 'nombre-corredor';
        nombre.textContent = p.nombre;

        const lineaMeta = document.createElement('div');
        lineaMeta.className = 'linea-meta';

        carril.appendChild(corredor);
        carril.appendChild(nombre);
        carril.appendChild(lineaMeta);

        pistaCarreras.appendChild(carril);
        elementosCaballos.push(corredor);
    });
}

function iniciarCarrera() {
    cuadroGanador.style.display = 'none';
    ganadorActual = null;

    participantes.forEach(p => {
        p.progreso = 0;
    });

    actualizarPista();
    botonIniciar.disabled = true;

    intervaloCarrera = setInterval(() => {
        let hayGanador = false;

        participantes.forEach((p, i) => {
            if (!hayGanador) {
                p.progreso += Math.random() * 2.5 + 1;

                const porcentaje = Math.min(p.progreso, 95);
                elementosCaballos[i].style.left = porcentaje + '%';

                if (p.progreso >= 95) {
                    hayGanador = true;
                    ganadorActual = p;
                }
            }
        });

        if (hayGanador) {
            clearInterval(intervaloCarrera);

            // Hacer que el ganador avance un poco más
            const indiceGanador = participantes.indexOf(ganadorActual);
            elementosCaballos[indiceGanador].style.left = '98%';

            // Mostrar ganador después de una pequeña pausa
            setTimeout(() => {
                mostrarGanador();
            }, 300);
        }
    }, 100);
}

function mostrarGanador() {
    botonIniciar.disabled = false;

    cuadroGanador.innerHTML = `
        <div class="cuadro-ganador">
            <h3>Ganador: ${ganadorActual.nombre}</h3>
            <div class="d-flex gap-2 justify-content-center">
                <button id="botonEliminar" class="btn btn-danger">Eliminar ganador</button>
                <button id="botonReintentar" class="btn btn-warning">Reintentar</button>
            </div>
        </div>
    `;

    cuadroGanador.style.display = 'block';

    document.getElementById('botonEliminar').addEventListener('click', eliminarGanador);
    document.getElementById('botonReintentar').addEventListener('click', reintentar);
}

function eliminarGanador() {
    // Devolver el sprite al pool cuando se elimina un participante
    spritesRestantes.push(ganadorActual.sprite);

    participantes = participantes.filter(p => p.id !== ganadorActual.id);
    ganadorActual = null;

    actualizarLista();
    actualizarPista();
    cuadroGanador.style.display = 'none';

    botonIniciar.disabled = participantes.length < 2;
}

function reintentar() {
    cuadroGanador.style.display = 'none';
    participantes.forEach(p => {
        p.progreso = 0;
    });
    actualizarPista();
}

function cambiarTema() {
    document.body.classList.toggle('modo-oscuro');
}

// Eventos
botonAgregar.addEventListener('click', agregarParticipante);

inputNombre.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        agregarParticipante();
    }
});

botonIniciar.addEventListener('click', iniciarCarrera);
botonTema.addEventListener('click', cambiarTema);