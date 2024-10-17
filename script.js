let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let level = 1; // Level variable
let moleSpeed = 1000; // Initial mole appearance speed

let tiles = []; // Array to store tiles
let activeTiles = new Set(); // Set to prevent overlap
let startTime = 30; // Game timer in seconds

window.onload = function () {
    setGame();
    startCountdown(startTime); // Start the countdown timer
    spawnMole(); // Start spawning moles recursively
    spawnPlant(); // Start spawning plants recursively
};

function setGame() {
    // Set up the grid using an array
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile); // Click to play
        tiles.push(tile); // Add tile to the array
        document.getElementById("board").appendChild(tile);
    }
}

function getRandomTile() {
    let num;
    do {
        num = Math.floor(Math.random() * 9); // Random number between 0-8
    } while (activeTiles.has(num)); // Ensure no overlap with existing tiles
    return num.toString();
}

function spawnMole() {
    if (gameOver) return; // Stop if the game is over

    if (currMoleTile) {
        currMoleTile.innerHTML = ""; // Clear previous mole
        activeTiles.delete(parseInt(currMoleTile.id)); // Remove from active set
    }

    let mole = document.createElement("img");
    mole.src = "./assets/monty-mole.png";
    mole.className = "mole"; // Add class for styling

    let num = getRandomTile();
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
    activeTiles.add(parseInt(num)); // Add to active set

    // Call the next mole appearance recursively after a delay based on the level
    setTimeout(spawnMole, moleSpeed);
}

function spawnPlant() {
    if (gameOver) return; // Stop if the game is over

    if (currPlantTile) {
        currPlantTile.innerHTML = ""; // Clear previous plant
        activeTiles.delete(parseInt(currPlantTile.id)); // Remove from active set
    }

    let plant = document.createElement("img");
    plant.src = "./assets/piranha-plant.png";

    let num = getRandomTile();
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
    activeTiles.add(parseInt(num)); // Add to active set

    // Call the next plant appearance recursively after 2 seconds
    setTimeout(spawnPlant, 2000);
}

function selectTile() {
    if (gameOver) return; // Stop if the game is over

    if (this === currMoleTile) {
        score += 10; // Increase score on click
        document.getElementById("score").innerText = score.toString();
        
        // Add visual effect
        this.classList.add("hit");
        setTimeout(() => this.classList.remove("hit"), 300); // Remove effect after 300ms

        // Check for level up
        if (score % 50 === 0) {
            level++;
            moleSpeed = Math.max(500, moleSpeed - 100); // Increase speed, min 500ms
        }
    } else if (this === currPlantTile) {
        endGame(); // Handle game over
    }
}

function startCountdown(time) {
    if (time <= 0) {
        gameOver = true;
        document.getElementById("score").innerText = "TIME UP! Score: " + score;
        showRestartButton(); // Show restart button when time is up
        return; // End the game when time runs out
    }
    document.getElementById("timer").innerText = "Time Left: " + time + "s";

    // Recursive call to update the timer every second
    setTimeout(() => startCountdown(time - 1), 1000);
}

function endGame() {
    document.getElementById("score").innerText = "GAME OVER: " + score.toString();
    document.getElementById("game-over").style.display = "block"; // Show game over text
    gameOver = true;

    setTimeout(showRestartButton, 2000); // Show restart button after 2 seconds
}

function showRestartButton() {
    document.getElementById("restart-btn").style.display = "block"; // Show restart button
    document.getElementById("restart-btn").addEventListener("click", () => location.reload()); // Reload the page on click
}
