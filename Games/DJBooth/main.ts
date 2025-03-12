// Get references to the canvas and DJ control buttons
const canvas = document.getElementById("roomCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const playButton = document.getElementById("playButton") as HTMLButtonElement;
const stopButton = document.getElementById("stopButton") as HTMLButtonElement;
const mixButton = document.getElementById("mixButton") as HTMLButtonElement;

// Resize the canvas to fill its container
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Game state variables
let energyLevel = 0; // Energy level increases with music play
const maxEnergy = 100;
let playing = false;

// Function to draw the room from the DJ's perspective
function drawRoom() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw a gradient background simulating room depth
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#444");
  gradient.addColorStop(1, "#222");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw perspective lines to simulate depth (e.g., floor tiles)
  const numLines = 10;
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 2;
  for (let i = 1; i < numLines; i++) {
    const y = (canvas.height / numLines) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw the crowd as a row of circles reacting to energyLevel
  const numPeople = 10;
  const spacing = canvas.width / (numPeople + 1);
  for (let i = 1; i <= numPeople; i++) {
    const baseRadius = 15;
    const radius = baseRadius + (energyLevel / maxEnergy) * 10;
    // Adjust color based on energy level
    const colorIntensity = Math.min(255, Math.floor((energyLevel / maxEnergy) * 255));
    ctx.fillStyle = `rgb(${colorIntensity}, ${255 - colorIntensity}, 0)`;

    // Position the crowd toward the top (simulate a room view)
    const x = i * spacing;
    const y = canvas.height * 0.3; // 30% from the top
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Update game state (e.g., decay energy level when not playing)
function updateGameState() {
  if (!playing && energyLevel > 0) {
    energyLevel = Math.max(0, energyLevel - 0.1);
  }
}

// Main game loop
function gameLoop() {
  updateGameState();
  drawRoom();
  requestAnimationFrame(gameLoop);
}
gameLoop();

// Event listeners for DJ controls
playButton.addEventListener("click", () => {
  playing = true;
  energyLevel = Math.min(maxEnergy, energyLevel + 15);
  // (Optionally, integrate real audio playback here.)
});

stopButton.addEventListener("click", () => {
  playing = false;
});

mixButton.addEventListener("click", () => {
  energyLevel = Math.min(maxEnergy, energyLevel + 10);
});

// Also add a key listener for additional interaction (e.g., space bar)
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    playing = true;
    energyLevel = Math.min(maxEnergy, energyLevel + 15);
  }
});
