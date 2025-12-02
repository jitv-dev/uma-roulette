# Uma Roulette

Una aplicación web interactiva de carreras aleatorias inspirada en Uma Musume. Agrega participantes, inicia la carrera y deja que la suerte decida quién gana.

## Descripción

Uma Roulette es una herramienta simple para tomar decisiones de forma aleatoria mediante carreras visuales. Cada participante recibe un sprite aleatorio de caballo y compite en una carrera donde el ganador se determina por azar. Ideal para sorteos, decisiones de grupo o simplemente para divertirse.

## Características

- Agregar hasta 8 participantes con nombres personalizados
- Sistema de sprites únicos sin repetición
- Animaciones fluidas de carrera
- Modo oscuro/claro
- Eliminar participantes antes de iniciar
- Sistema Battle Royale: elimina al ganador y vuelve a competir
- Interfaz responsive y fácil de usar

## Uso

1. Ingresa nombres de participantes en el campo de texto
2. Agrega entre 2 y 8 participantes
3. Haz clic en "Iniciar carrera" para comenzar
4. El ganador se mostrará al finalizar
5. Puedes eliminar al ganador para la siguiente ronda o reintentar con los mismos participantes

## Demo

Puedes ver la aplicación en funcionamiento en: [GitHub Pages URL]

## Instalación Local

Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/uma-roulette.git
cd uma-roulette
```

Abre el archivo `index.html` en tu navegador web favorito. No se requieren dependencias adicionales ni proceso de compilación.

## Estructura del Proyecto

```
uma-roulette/
├── index.html          # Estructura principal
├── styles.css          # Estilos de la aplicación
├── script.js           # Lógica de la aplicación
└── horses/            # Carpeta con sprites de caballos
    ├── caballo1.gif
    ├── caballo2.gif
    └── ...
```

## Tecnologías

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.2

## Personalización

Para usar tus propios sprites, simplemente reemplaza los archivos GIF en la carpeta `horses/`. Asegúrate de mantener los nombres de archivo o actualiza el array `spritesDisponibles` en `script.js`.

## Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

## Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún error o tienes sugerencias de mejora, no dudes en abrir un issue o enviar un pull request.

## Créditos

Inspirado en la franquicia Uma Musume Pretty Derby.