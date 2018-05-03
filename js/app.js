const enemies = [50, 145, 210, 145, 50, 200];
const points = document.getElementById('points');
const modal = document.getElementById('gameOverModal');
const winModal = document.getElementById('winningModal');
const hearts = document.getElementsByClassName('lives')[0];
let score = 0;

// Open modal in case of defeat
const openModal = () => {
  modal.style.display = 'flex';
};

// Opens victory modal once player win game
const openVictoryModal = () => {
  winModal.style.display = 'flex';
};

// Closes modal, starts new game
const modalClose = () => {
  modal.style.display = 'none';
  window.location.reload();
};

// Listen for click event
modal.addEventListener('click', modalClose);
winModal.addEventListener('click', modalClose);

class Game {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
  }
  render() {
    window.ctx.drawImage(window.Resources.get(this.image), this.x, this.y);
  }
}

// Player class
class Player extends Game {
  constructor(x, y, image, lives) {
    super(x, y, image, lives);
    this.lives = lives;
  }

  update() {
    // adds 100 points each time the player reaches the water.If the score reaches 1000 points he wins
    if (this.y < 40) {
      this.x = 200;
      this.y = 380;
      score += 100;
      points.innerText = score;
      if (score === 1000) {
        openVictoryModal();
      }
    }
  }
  // this function is for player's movement using the up,down,left and right keys
  handleInput(key) {
    if (key === 'left' && this.x > 0) this.x -= 100;
    else if (key === 'right' && this.x < 400) this.x += 100;
    else if (key === 'up') this.y -= 80;
    else if (key === 'down' && this.y < 380) this.y += 80;
  }

  // Checks for collisions, if collision removes heart, if no hearts defeat
  checkLives(arr) {
    this.lives -= 1;
    hearts.removeChild(hearts.children[0]);
    if (this.lives === 0) {
      this.image = 'images/ghost.png';
      arr.forEach((enemy) => {
        enemy.speed = 0;
      });
      openModal();
    }
  }
}

// Instantiate new player
const player = new Player(200, 380, 'images/char-boy.png', 3);

// player movement keys handler
document.addEventListener('keyup', (e) => {
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

// Enemy class
class Enemy extends Game {
  constructor(x, y, image, speed) {
    super(x, y, image, speed);
    this.speed = speed;
  }

  /* Every time a bug reaches the end of canvas, it starts from the new random point with different speed */
  update(dt) {
    if (this.x < 505) {
      this.x += dt * 15 * this.speed * Math.random();
    } else {
      const i = Math.floor(Math.random() * enemies.length) + 1;
      this.y = enemies[i];
      this.x = -100;
    }

    // collisions check
    // https://stackoverflow.com/q/2440377
    const a = this.x - player.x;
    const b = this.y - player.y;
    const c = 70;
    if (a * a + b * b <= c * c) {
      player.x = 200;
      player.y = 380;
      player.checkLives(allEnemies);
    }
  }
}

// Instantiate enemies
const enemy1 = new Enemy(-100, 140, 'images/enemy-bug.png', 50);
const enemy2 = new Enemy(-100, 60, 'images/enemy-bug.png', 20);
const enemy3 = new Enemy(-100, 220, 'images/enemy-bug.png', 30);
const allEnemies = [enemy1, enemy2, enemy3];
