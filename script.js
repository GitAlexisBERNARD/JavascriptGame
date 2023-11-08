// Obtenir des éléments de l'interface de jeu
const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const attackRangeIndicator = document.getElementById('attack-range-indicator');


// Variables contrôler le jeu
let playerPosition = gameContainer.offsetWidth / 2; // Commence au milieu de l'écran
const playerSpeed = 5; // Vitesse du déplacement du joueur
const enemySpeed = 1; // Vitesse à laquelle les ennemis s'approchent
const attackRange = 200; // Distance à laquelle les ennemis attaquent le joueur
let isAttacking = false; // variable pour suivre si le joueur est en train d'attaquer   
let enemies = []; // Tableau pour stocker les ennemis
let lives = 3; // le joueur commence avec 3 vies
let isInvincible = false; // Indicateur d'invincibilité

document.addEventListener('keydown', function(event) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    // Déterminer la direction de l'attaque
    const direction = (event.key === "ArrowLeft") ? 1 : -1;

    // Trouver l'ennemi le plus proche dans la direction de l'attaque
    let closestEnemy = null;
    let closestDistance = Number.MAX_VALUE;

    for (const enemy of enemies) {
      // Calculer la distance de l'ennemi par rapport au joueur
      const distance = Math.abs(enemy.xPosition - playerPosition);

      if (enemy.direction === direction && distance < closestDistance && distance <= attackRange) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    }

 if (closestEnemy) {
  // Téléporter le joueur à une certaine distance avant la position de l'ennemi le plus proche
  const teleportOffset = 100; // la distance avant l'ennemi où le joueur apparaîtra
  isAttacking = true;  
  playerPosition = closestEnemy.xPosition + (direction * teleportOffset);
  player.style.left = `${playerPosition}px`;

  // Supprimez l'ennemi du DOM et du tableau
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
  // Positionnez l'ennemi à gauche (-30px) ou à droite (juste hors de l'écran à droite)
  enemy.style.left = Math.random() < 0.5 ? '-30px' : `${gameContainer.offsetWidth}px`;
  // L'ennemi doit apparaître sur la même ligne que le joueur
  enemy.style.top = `${player.offsetTop}px`;
  gameContainer.appendChild(enemy);

  enemies.push({
    element: enemy,
    xPosition: parseInt(enemy.style.left, 10),
    direction: enemy.style.left === '-30px' ? 1 : -1 // Déterminer la direction basée sur la position initiale
  });
}

function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    // Déplacer l'ennemi vers le joueur
    enemy.xPosition += enemy.direction * enemySpeed;

    // Si le joueur est en train d'attaquer, on saute la vérification de collision
    if (!isAttacking) {
      // Vérifier si l'ennemi a atteint la position du joueur pour déclencher game over
if ((enemy.direction === 1 && enemy.xPosition >= playerPosition && enemy.xPosition < playerPosition + player.offsetWidth) ||
    (enemy.direction === -1 && enemy.xPosition <= playerPosition + player.offsetWidth && enemy.xPosition > playerPosition)) {
  removeLife(); // le joueur perd une vie au lieu de game over
  return; // sortir de la fonction si vous voulez arrêter de vérifier les autres ennemis après avoir perdu une vie
}
    }

    // Mettre à jour la position de l'ennemi sur l'écran
    enemy.element.style.left = `${enemy.xPosition}px`;
  }
}

function resetGame() {
  // Réinitialiser les vies visuellement
  const livesContainer = document.getElementById('lives-container');
  livesContainer.innerHTML = `
    <img src="heart.png" class="life" />
    <img src="heart.png" class="life" />
    <img src="heart.png" class="life" />
  `;
  lives = 3;
  // autre logique de réinitialisation du jeu
}

function removeLife() {
  if (!isInvincible) {
    lives--; // décrémenter le nombre de vies
    const livesContainer = document.getElementById('lives-container');
    if (livesContainer.children.length > 0) {
      livesContainer.removeChild(livesContainer.children[0]); // enlever une icône de vie du DOM
    }

    if (lives <= 0) {
      gameOver(); // fin du jeu si le joueur n'a plus de vies
    } else {
      // Début de la période d'invincibilité
      isInvincible = true;
      setTimeout(() => {
        isInvincible = false; // Le joueur peut à nouveau perdre des vies après 3 secondes, par exemple
      }, 3000);
    }
  }
}
function updateAttackRangeIndicator() {
  const attackRangeBar = document.getElementById('attack-range-bar');
  
  // Positionnez la barre d'attaque sous le joueur en utilisant la moitié de la largeur du joueur pour centrer
  const barPositionX = playerPosition + (player.offsetWidth / 2) - (attackRange / 2);
  const barPositionY = player.offsetTop + player.offsetHeight;

  attackRangeBar.style.left = `${barPositionX}px`;
  attackRangeBar.style.top = `${barPositionY}px`;
  attackRangeBar.style.width = `${attackRange}px`;
}

function gameOver() {
  alert('Game Over!');
  // votre logique de fin de jeu
  resetGame();
}

function gameLoop() {
  updateEnemies();
  
  // Générer des ennemis de façon aléatoire
  updateAttackRangeIndicator();
  if (Math.random() < 0.02) { // Ajustez ce nombre pour changer la fréquence d'apparition des ennemis
    spawnEnemy();
  }
  requestAnimationFrame(gameLoop);
}

// Démarrer le jeu
gameLoop();