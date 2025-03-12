// Get references to the canvas and button
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!; // Non-null assertion since we know the canvas exists
const playButton = document.getElementById("playButton") as HTMLButtonElement;

// Ensure the canvas resizes to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game state variables
let energyLevel = 0; // Represents the DJ's music energy
const maxEnergy = 100;

// Function to draw the DJ booth
function drawDJBooth() {
  // For simplicity, draw a rectangle at the bottom center
  const boothWidth = 200;
  const boothHeight = 100;
  const x = (canvas.width - boothWidth) / 2;
  const y = canvas.height - boothHeight - 20;
  
  ctx.fillStyle = "#555";
  ctx.fillRect(x, y, boothWidth, boothHeight);
  
  // Add some text to indicate the booth
  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("DJ Booth", x + 50, y + 55);
}

// Function to draw the crowd
function drawCrowd() {
  // For simplicity, draw a row of circles that react to energyLevel
  const numPeople = 10;
  const spacing = canvas.width / (numPeople + 1);
  
  for (let i = 1; i <= numPeople; i++) {
    // The size and brightness of each "person" depends on the energy level
    const baseRadius = 15;
    const radius = baseRadius + (energyLevel / maxEnergy) * 10; // Increase size with energy
    // Color intensity changes with energy
    const colorIntensity = Math.min(255, Math.floor((energyLevel / maxEnergy) * 255));
    ctx.fillStyle = `rgb(${colorIntensity}, ${255 - colorIntensity}, 0)`;
    
    const x = i * spacing;
    const y = canvas.height - 150;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Main game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background elements (could add a simple gradient or static background)
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw the crowd and DJ booth
  drawCrowd();
  drawDJBooth();
  
  // Optionally, slowly decrease energy over time
  energyLevel = Math.max(0, energyLevel - 0.1);
  
  requestAnimationFrame(gameLoop);
}

// Event listener for playing music (simulate by increasing energy level)
playButton.addEventListener("click", () => {
  // Increase energy level when the button is clicked
  energyLevel = Math.min(maxEnergy, energyLevel + 10);
  // Optionally, trigger audio playback here using Tone.js or HTML5 Audio
});

// Also add a key listener for additional interaction (e.g., space bar)
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    energyLevel = Math.min(maxEnergy, energyLevel + 10);
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Start the game loop
gameLoop();
