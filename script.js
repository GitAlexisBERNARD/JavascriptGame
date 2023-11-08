const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const attackRangeIndicator = document.getElementById('attack-range-indicator');

let playerPosition = gameContainer.offsetWidth / 2;
const playerSpeed = 5;
const enemySpeed = 1;
const attackRange = 600;
let isAttacking = false;
let enemies = [];

document.addEventListener('keydown', function(event) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    const direction = (event.key === "ArrowLeft") ? 1 : -1;

    let closestEnemy = null;
    let closestDistance = Number.MAX_VALUE;

    for (const enemy of enemies) {
      const distance = Math.abs(enemy.xPosition - playerPosition);

      if (enemy.direction === direction && distance < closestDistance && distance <= attackRange) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    }

    if (closestEnemy) {
      isAttacking = true;  
      playerPosition = closestEnemy.xPosition;
      player.style.left = `${playerPosition}px`;

      closestEnemy.element.remove();
      enemies.splice(enemies.indexOf(closestEnemy), 1);
      setTimeout(() => {
        isAttacking = false;
      }, 100);
    }
  }
});

function spawnEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = Math.random() < 0.5 ? '-30px' : `${gameContainer.offsetWidth}px`;
  enemy.style.top = `${player.offsetTop}px`;
  gameContainer.appendChild(enemy);

  enemies.push({
    element: enemy,
    xPosition: parseInt(enemy.style.left, 10),
    direction: enemy.style.left === '-30px' ? 1 : -1
  });
}

function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.xPosition += enemy.direction * enemySpeed;

    if (!isAttacking) {
      if ((enemy.direction === 1 && enemy.xPosition >= playerPosition && enemy.xPosition < playerPosition + player.offsetWidth) ||
          (enemy.direction === -1 && enemy.xPosition <= playerPosition + player.offsetWidth && enemy.xPosition > playerPosition)) {
        gameOver();
        return;
      }
    }

    enemy.element.style.left = `${enemy.xPosition}px`;
  }
}

function gameOver() {
  alert('Game Over!');

  enemies.forEach(enemy => {
    gameContainer.removeChild(enemy.element);
  });
  enemies = [];

  playerPosition = gameContainer.offsetWidth / 2;
  player.style.left = `${playerPosition}px`;
}

function updateAttackRangeIndicator() {
  attackRangeIndicator.style.left = `${playerPosition}px`;
  attackRangeIndicator.style.width = `${attackRange}px`;
}

function gameLoop() {
  updateEnemies();
  
  if (Math.random() < 0.02) {
    spawnEnemy();
  }
  
  requestAnimationFrame(gameLoop);
}

gameLoop();
