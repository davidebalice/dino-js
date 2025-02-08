const playerElement = document.querySelector(".player");
const obstacleElement = document.querySelector(".obstacle");
const scoreElement = document.querySelector(".score-card .score");
const highScoreElement = document.querySelector(".score-card .high-score");
const restartGameElement = document.querySelector(".restart-game");
const gameContainerElement = document.querySelector(".game-container");
const jumpSound = new Audio("./assets/jump.wav");
const music = new Audio("./assets/music.mp3");
const ahi = new Audio("./assets/ahi.wav");
music.loop = true;
music.volume = 0.5;
music.play();
let musicPlaying = true;

const toggleMusicButton = document.getElementById("toggle-music");
const soundIcon = document.getElementById("sound-icon");

// Aggiungi un listener per il pulsante di toggle della musica
toggleMusicButton.addEventListener("click", () => {
  if (musicPlaying) {
    music.pause();
    soundIcon.src = "./assets/sound.png";
  } else {
    music.play();
    soundIcon.src = "./assets/mute.png";
  }
  musicPlaying = !musicPlaying;
});

const OBSTACLE_SIZES = ["xs", "s", "m", "l"];

// Aggiungi un listener per il salto
function addJumpListener() {
  document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "ArrowUp") {
      jump();
    }
  });
}

let jumping = false;
function jump() {
  if (jumping) {
    return;
  }

  jumping = true;
  jumpSound.currentTime = 0;
  jumpSound.play();
  playerElement.classList.add("jump");
  setTimeout(() => {
    playerElement.classList.remove("jump");
    jumping = false;
  }, 1200); // Durata del salto
}

let collisionInterval;
// Monitora le collisioni
function monitorCollision() {
  collisionInterval = setInterval(() => {
    if (isCollision()) {
      checkForHighScore();
      stopGame();
    }
  }, 10);
}

const LEFT_BUFFER = 50;
// Controlla se c'è una collisione
function isCollision() {
  const playerClientRect = playerElement.getBoundingClientRect();
  const playerL = playerClientRect.left;
  const playerR = playerClientRect.right;
  const playerB = playerClientRect.bottom;

  const obstacleClientRect = obstacleElement.getBoundingClientRect();
  const obstacleL = obstacleClientRect.left;
  const obstacleR = obstacleClientRect.right;
  const obstacleT = obstacleClientRect.top;

  //determina la collisione in base alla posizione
  const xCollision = obstacleR - LEFT_BUFFER > playerL && obstacleL < playerR;
  const yCollision = playerB > obstacleT;

  return xCollision && yCollision;
}

let score = 0;
// Imposta il punteggio
function setScore(newScore) {
  scoreElement.innerHTML = score = newScore;
}

let scoreInterval;
// Conta il punteggio
function countScore() {
  scoreInterval = setInterval(() => {
    setScore(score + 1);
  }, 100);
}

let highscore = localStorage.getItem("highscore") || 0;
// Imposta il punteggio più alto
function setHighScore(newScore) {
  highScoreElement.innerText = highscore = newScore;
  localStorage.setItem("highscore", newScore);
}

// Controlla se il punteggio attuale è un nuovo record
function checkForHighScore() {
  if (score > highscore) {
    setHighScore(score);
  }
}

// Ottieni una dimensione casuale per l'ostacolo
function getRandomObstacleSize() {
  const index = Math.floor(Math.random() * OBSTACLE_SIZES.length);
  return OBSTACLE_SIZES[index];
}

let changeObstacleInterval;

// Randomizza gli ostacoli con un ritardo iniziale
function randomiseObstacle() {
  obstacleElement.classList.add("hidden-obstacle"); // Nascondi gli ostacoli inizialmente
  setTimeout(() => {
    obstacleElement.classList.remove("hidden-obstacle"); // Mostra gli ostacoli dopo il ritardo
    changeObstacleInterval = setInterval(() => {
      const obstacleSize = getRandomObstacleSize();
      obstacleElement.className = `obstacle obstacle-${obstacleSize}`;
    }, 1500);
  }, 3000); // Ritardo di 3 secondi prima dell'inizio della comparsa degli ostacoli
}

// Ferma il gioco
function stopGame() {
  clearInterval(collisionInterval);
  clearInterval(scoreInterval);
  clearInterval(changeObstacleInterval);
  restartGameElement.classList.add("show");
  gameContainerElement.classList.add("stop");
  music.pause();
  musicPlaying = false;
  soundIcon.src = "./assets/sound.png";
  ahi.play();
  jumping = true;
}

// Riavvia il gioco
function restart() {
  location.reload();
}

// Funzione principale per iniziare il gioco
function main() {
  addJumpListener();
  monitorCollision();
  countScore();
  setHighScore(highscore);
  randomiseObstacle();
}

main();
