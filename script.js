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

let spritesRestantes = [...spritesDisponibles].sort(() => Math.random() - 0.5);

function obtenerSpriteUnico() {
    if (spritesRestantes.length === 0) {
        spritesRestantes = [...spritesDisponibles].sort(() => Math.random() - 0.5);
    }
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
        spritesRestantes.push(participante.sprite);
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
        p.enRemontada = false;
        p.yaRemonto = false;
    });

    actualizarPista();
    botonIniciar.disabled = true;

    let ticksTranscurridos = 0;

    intervaloCarrera = setInterval(() => {
        let hayGanador = false;
        ticksTranscurridos++;

        participantes.forEach((p, i) => {
            if (!hayGanador) {
                // Velocidad completamente aleatoria cada tick
                let incremento = Math.random() * 1.5 + 0.5;

                // Mini-boosts ocasionales
                if (Math.random() < 0.08) {
                    incremento *= 1.5;
                }

                // Remontada épica
                if (!p.enRemontada && !p.yaRemonto && ticksTranscurridos > 25 && Math.random() < 0.002) {
                    const progresoMax = Math.max(...participantes.map(x => x.progreso));
                    const todosLosProgresos = participantes.map(x => x.progreso).sort((a, b) => b - a);
                    const posicion = todosLosProgresos.indexOf(p.progreso) + 1;
                    const totalParticipantes = participantes.length;

                    if ((posicion > totalParticipantes - 3 || p.progreso < progresoMax - 8) &&
                        p.progreso > 20 &&
                        p.progreso < 65) {

                        p.enRemontada = true;
                        p.yaRemonto = true;
                        p.ticksRemontada = Math.floor(Math.random() * 18) + 15;
                        elementosCaballos[i].style.filter = 'brightness(1.5) saturate(1.3) drop-shadow(0 0 12px gold)';

                        mostrarMensajeBoost(i, p.nombre);
                    }
                }

                if (p.enRemontada) {
                    incremento *= 2.5;
                    p.ticksRemontada--;

                    if (p.ticksRemontada <= 0) {
                        p.enRemontada = false;
                        elementosCaballos[i].style.filter = '';
                    }
                }

                p.progreso += Math.max(0.4, incremento);

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
            elementosCaballos.forEach(el => el.style.filter = '');

            const indiceGanador = participantes.indexOf(ganadorActual);
            elementosCaballos[indiceGanador].style.left = '98%';

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

function mostrarMensajeBoost(indice, nombre) {
    const carril = pistaCarreras.children[indice];

    const mensajeBoost = document.createElement('div');
    mensajeBoost.className = 'mensaje-boost';
    mensajeBoost.innerHTML = `
        <span style="font-size: 24px; font-weight: bold; color: gold; text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);">
            ⚡ BOOST! ⚡
        </span>
        <div style="font-size: 14px; color: #ffd700; margin-top: 5px;">
            ${nombre} acelera!
        </div>
    `;

    carril.appendChild(mensajeBoost);

    setTimeout(() => {
        if (mensajeBoost.parentNode) {
            mensajeBoost.remove();
        }
    }, 2000);
}

function cambiarTema() {
    document.body.classList.toggle('modo-oscuro');
}

botonAgregar.addEventListener('click', agregarParticipante);

inputNombre.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        agregarParticipante();
    }
});

botonIniciar.addEventListener('click', iniciarCarrera);
botonTema.addEventListener('click', cambiarTema);