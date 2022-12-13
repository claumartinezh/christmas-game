const sky = document.querySelector('main.sky');
const item = document.querySelector('div.item');
const info = document.querySelector('p.info');

const EMOJI_LIST = ['❄️', '🎄', '🎅', '🔔', '🦌', '🎁', '⛄'];
const EMOJI_OK = '✨';
const EMOJI_KO = '💥';
const EMOJI_CLOUD = '☁️';

const SOUND_OK = new Audio('./sounds/ok.mp3');
const SOUND_KO = new Audio('./sounds/ko.mp3');

let points = 0;
let gameOver = false;
let animationDuration = 8000;

// Gestión de click en el item
item.addEventListener('click', () => {
  if (EMOJI_LIST.includes(item.textContent)) {
    // Pauso la animacion
    pauseAnimation();

    // Indico el elemento q se salvó
    item.textContent = EMOJI_OK;

    // Añado efecto de sonido
    SOUND_OK.play();

    // Sumar puntos
    points++;

    // Muestro puntos en pantalla
    info.textContent = `${points} puntos`;

    // Actualizo la opacidad del item
    item.style.opacity = 0;

    // Aumento la velocidad de animacion
    animationDuration = animationDuration > 500 ? animationDuration - 200 : 500;

    // Vuelvo a lanzar otro emoji
    setTimeout(run, 500);
  }
})

// Método que añade una nube
function addCloud() {
  // Creo el elemento y le asigno el emoji de nube
  const cloud = document.createElement('span');
  cloud.textContent = EMOJI_CLOUD;
  cloud.classList.add('cloud');

  // Cambio el tamaño
  cloud.style.fontSize = `${20 * Math.random()}rem`;

  // Extraigo tamaño del sky y de la cloud
  const skyDimensions = sky.getBoundingClientRect();
  const cloudDimensions = cloud.getBoundingClientRect();

  // Posiciono la cloud
  cloud.style.top = `${skyDimensions.height * Math.random()}px`;
  cloud.style.left = `${skyDimensions.width * Math.random() - cloudDimensions.width}px`;

  sky.append(cloud);
}

// Método loop principal de animación
function run() {
  if (points > 0) {
    // Añado una nube al cielo
    addCloud();
  }

  // Reseteo opacidad del item
  item.style.opacity = 1;

	//Extraer ancho del elemento sky para saber de donde sacar los items
	const skyDimentions = sky.getBoundingClientRect();
	const skyWidth = skyDimentions.width;
	const skyHeight = skyDimentions.height;

	// Asignar emoji aleatorio al item
	item.textContent = EMOJI_LIST[Math.floor(EMOJI_LIST.length * Math.random())];

	// Asignar un tamaño aleatorio al item
	item.style.fontSize = `${2 + 2 * Math.random()}rem`;

	// Extraer el ancho del item despues de aplicar el tamaño de letra
	const itemDimensions = item.getBoundingClientRect();

	// Establecer las coordenadas de animacion
	const x = Math.random() * skyWidth - itemDimensions.width / 2;
	const y = Math.random() * skyHeight;

	// Iniciar animacion desde abajo a arriba
	const animation = item.animate(
		[
			{ transform: `translate(${x}px, ${skyHeight}px)` },
			{ transform: `translate(${x}px, 0)` },
		],
		{
			duration: animationDuration,
			fill: 'both',
		}
	);

  animation.onfinish = endGame;
}

// Pause item animation
function pauseAnimation() {
  for (const animation of item.getAnimations()) {
    animation.pause()
  }
}

// Cancel item animation
function cancelAnimation() {
  for (const animation of item.getAnimations()) {
    animation.cancel()
  }
}

// Al terminar la partida
function endGame() {
  gameOver = true;
  SOUND_KO.play();
  item.textContent = EMOJI_KO;
  info.textContent = `Game over. Salvaste ${points} emojis. Recarga la página para volver a jugar`
}

run();
