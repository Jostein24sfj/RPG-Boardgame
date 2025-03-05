// Game board (2D array)
let gameBoard = [
  ["", "", "T", "M", "T"],
  ["M", "M", "M", "T", "M"],
  ["", "T", "M", "", ""],
  ["M", "M", "T", "M", "M"],
  ["T", "M", "", "M", "D"],
];

// Player object
let player = {
  x: 0, // Starting row
  y: 0, // Starting column

  health: 100,
  inventory: [],

  move: function (direction) {
    // console.log(
    //   `Move function called. Current position: (${this.x}, ${this.y})`
    // );
    let newX = this.x;
    let newY = this.y;
    // Check movement within boundaries
    if (direction === "ArrowUp" && this.x > 0) newX--; // Move up
    if (direction === "ArrowDown" && this.x < 4) newX++; // Move down
    if (direction === "ArrowLeft" && this.y > 0) newY--; // Move left
    if (direction === "ArrowRight" && this.y < 4) newY++; // Move right
    // Update player position
    this.x = newX;
    this.y = newY;

    this.collectTreasure(); // Check for treasure
    this.fightMonster(); // Check for monster encounter
    console.log(`New position: (${this.x}, ${this.y})`); // Should show updated position
    // Re-render the board
    renderBoard();
    updatePlayerStats();
    checkGameOver(); // Check if game is over after any action
  },

  collectTreasure: function () {
    if (gameBoard[this.x][this.y] === "T") {
      console.log("Treasure collected!");
      this.inventory.push("Treasure"); // Add treasure to inventory
      gameBoard[this.x][this.y] = ""; // Remove treasure from the board
      renderBoard(); // Update the grid
      updatePlayerStats(); // Update the player UI
    }
  },

  fightMonster: function () {
    if (gameBoard[this.x][this.y] === "M") {
      console.log("Monster encountered! Fighting...");

      // Example fight: lose 20 health
      this.health -= 20;
      if (this.health <= 0) {
        console.log("You were defeated by the monster.");
        alert("Game Over!"); // Display a game over message
        // Optional: Add logic to end the game if health is 0 or below
      } else {
        console.log(
          `You fought the monster! Your health is now ${this.health}`
        );
      }

      // Remove monster from the board after the fight
      gameBoard[this.x][this.y] = "";

      renderBoard(); // Update the grid
      updatePlayerStats(); // Update player stats (show updated health)
    }
  },
};

function checkGameOver() {
  // Check if player has collected all treasures
  const allTreasuresCollected = !gameBoard.some((row) => row.includes("T"));
  // Check if player har reached the door
  const playerAtDoor = gameBoard[player.x][player.y] === "D";
  // Check if player's health is 0 or less
  const playerDead = player.health <= 0;

  if (allTreasuresCollected && playerAtDoor) {
    console.log("You collected all treasures and reached the door! You win!");
    alert("You collected all treasures and reached the door! You win!");
    // You can reset the game or end it here
  } else if (playerDead) {
    console.log("You have been defeated. Game over!");
    alert("You have been defeated. Game over!");
  }
}

function handleKeyPress(event) {
  console.log(`Key pressed: ${event.key}`);
  player.move(event.key); // Calls move, which updates the board
}

function renderBoard() {
  console.log("renderBoard() called"); // Debugging log

  const cells = document.querySelectorAll(".grid-item");

  // Clear previous board
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.className = "grid-item"; // Reset classes
  });

  let playerIndex = player.x * 5 + player.y;
  cells[playerIndex].classList.add("player");

  // ✅ Debugging: Print the player's position
  console.log(
    `Player is at: (${player.x}, ${player.y}), Index: ${playerIndex}`
  );
  console.log(cells[playerIndex]); // This will log the correct cell in the console

  // Place objects based on the "gameBoard"
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      let index = row * 5 + col;
      if (gameBoard[row][col] === "T") cells[index].classList.add("treasure");
      if (gameBoard[row][col] === "M") cells[index].classList.add("monster");
      if (gameBoard[row][col] === "D") cells[index].classList.add("door");
    }
  }
}

// Get the grid container
const gameGrid = document.getElementById("gameGrid");

// Loop to create a 5x5 grid
for (let i = 0; i < 25; i++) {
  // Create a new grid item
  const gridItem = document.createElement("div");
  gridItem.classList.add("grid-item"); // Add a class to style it
  gameGrid.appendChild(gridItem); // Add it to the container
}

// Function to update player stats
function updatePlayerStats() {
  const stats = document.getElementById("playerStats");
  stats.innerHTML = `
    <p class="playerHealth">Health: ${player.health}</p>
    <p class="playerInventory">Inventory: ${
      player.inventory.join(", ") || "Empty"
    }</p>
    `;
}

// Event listener for keypresses
document.addEventListener("keydown", handleKeyPress);

// Initial setup
renderBoard();
updatePlayerStats();
