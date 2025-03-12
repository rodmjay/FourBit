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

// Global game state
let energyLevel = 0; // Increases when music is played
const maxEnergy = 100;
let playing = false;
let startTime = Date.now();

// Define a structure for our block people (dancers)
interface BlockPerson {
  x: number;         // x-position in the canvas
  baseWidth: number; // base width of the block person
  baseHeight: number;// base height (before dancing animation)
  color: string;     // fill color
}

// Create an array of block people placed along the floor
const numPeople = 8;
const people: BlockPerson[] = [];
for (let i = 0; i < numPeople; i++) {
  const person: BlockPerson = {
    x: canvas.width * (0.2 + 0.6 * (i / (numPeople - 1))), // evenly spaced horizontally
    baseWidth: 20,
    baseHeight: 40,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16)
  };
  people.push(person);
}

// Function to draw the room with perspective
function drawRoom() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Define key dimensions based on canvas size for perspective
  const ceilingHeight = canvas.height * 0.25;
  const floorY = canvas.height * 0.75; // where the floor starts (from DJ's view)
  const backWallHeight = canvas.height * 0.15;
  const backWallY = ceilingHeight; // back wall sits right below the ceiling
  const doorWidth = canvas.width * 0.15;
  const doorHeight = canvas.height * 0.4;
  const doorX = (canvas.width - doorWidth) / 2;
  const doorY = backWallY + (backWallHeight - doorHeight) / 2;

  // Draw the ceiling (top area)
  ctx.fillStyle = "#666";
  ctx.fillRect(0, 0, canvas.width, ceilingHeight);

  // Draw the back wall (center area between ceiling and floor)
  ctx.fillStyle = "#777";
  ctx.fillRect(canvas.width * 0.1, backWallY, canvas.width * 0.8, backWallHeight);

  // Draw the door on the back wall
  ctx.fillStyle = "#333";
  ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
  // Optional: draw a door frame
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);

  // Draw the floor as a trapezoid (from the bottom of the back wall to the bottom of the canvas)
  ctx.fillStyle = "#444";
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.1, floorY);
  ctx.lineTo(canvas.width * 0.9, floorY);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();

  // Draw left wall as a trapezoid
  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas.width * 0.1, floorY);
  ctx.lineTo(canvas.width * 0.1, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();

  // Draw right wall as a trapezoid
  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.moveTo(canvas.width, 0);
  ctx.lineTo(canvas.width * 0.9, floorY);
  ctx.lineTo(canvas.width * 0.9, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
  ctx.fill();

  // Draw overhead lights on the ceiling
  const lightRadius = 8;
  const numLights = 5;
  ctx.fillStyle = "#ff0"; // yellow for a warm light effect
  for (let i = 0; i < numLights; i++) {
    const lightX = canvas.width * 0.15 + i * (canvas.width * 0.15);
    const lightY = ceilingHeight * 0.5;
    ctx.beginPath();
    ctx.arc(lightX, lightY, lightRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add perspective lines on the floor to enhance depth
  const numLines = 10;
  ctx.strokeStyle = "#777";
  ctx.lineWidth = 1;
  for (let i = 1; i < numLines; i++) {
    const y = floorY + ((canvas.height - floorY) / numLines) * i;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.1, y);
    ctx.lineTo(canvas.width * 0.9, y);
    ctx.stroke();
  }
}

// Function to draw dancing block people on the floor
function drawDancingPeople(time: number) {
  // Define a base line for the dancers (e.g., floor level in the room)
  const baseY = canvas.height * 0.75; 

  for (const person of people) {
    // Use a sine wave to simulate dancing motion
    const danceFactor = Math.abs(Math.sin((time + person.x) * 0.005));
    const offsetY = danceFactor * 10 * (energyLevel / maxEnergy);

    // Define dimensions for each body part
    const headRadius = 8;
    const torsoHeight = person.baseHeight * 0.6; // previously defined baseHeight
    const torsoWidth = person.baseWidth;   // previously defined baseWidth
    const armWidth = 5;
    const armLength = torsoHeight * 0.5;
    const legLength = 20 + danceFactor * 10; // legs adjust with dance factor

    // Calculate positions
    // Head: Positioned above the torso with a slight offset from dancing motion
    const headX = person.x;
    const headY = baseY - (torsoHeight + headRadius * 2 + offsetY);

    // Torso: Drawn as a rectangle directly under the head
    const torsoX = person.x - torsoWidth / 2;
    const torsoY = headY + headRadius * 2;

    // Arms: Swing left and right using a sine function for a natural motion
    const armSwing = Math.sin((time + person.x) * 0.01) * 5;
    const leftArmX = torsoX - armWidth;
    const rightArmX = torsoX + torsoWidth;
    const armsY = torsoY + 10; // arms start a little below the top of the torso

    // Legs: Slight swing as well
    const legSwing = Math.cos((time + person.x) * 0.01) * 3;
    const leftLegX = person.x - armWidth - 2;
    const rightLegX = person.x + 2;
    const legY = baseY - legLength; // legs start at the base line

    // Draw head (circle)
    ctx.fillStyle = person.color;
    ctx.beginPath();
    ctx.arc(headX, headY + headRadius, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw torso (rectangle)
    ctx.fillStyle = person.color;
    ctx.fillRect(torsoX, torsoY, torsoWidth, torsoHeight);

    // Draw left arm
    ctx.fillRect(leftArmX, armsY + armSwing, armWidth, armLength);

    // Draw right arm
    ctx.fillRect(rightArmX, armsY - armSwing, armWidth, armLength);

    // Draw left leg
    ctx.fillRect(leftLegX, legY + legSwing, armWidth, legLength);

    // Draw right leg
    ctx.fillRect(rightLegX, legY - legSwing, armWidth, legLength);
  }
}

// Function to draw the DJ booth with perspective
function drawDJBooth() {
  // The DJ booth is drawn as a trapezoid in the bottom center
  const boothHeight = 80;
  const boothWidthTop = 200;
  const boothWidthBottom = 300;
  const centerX = canvas.width / 2;
  const bottomY = canvas.height;
  const topY = bottomY - boothHeight;

  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.moveTo(centerX - boothWidthTop / 2, topY);
  ctx.lineTo(centerX + boothWidthTop / 2, topY);
  ctx.lineTo(centerX + boothWidthBottom / 2, bottomY);
  ctx.lineTo(centerX - boothWidthBottom / 2, bottomY);
  ctx.closePath();
  ctx.fill();

  // Draw an outline to emphasize the booth's perspective
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Update game state (e.g., energy level decay)
function updateGameState() {
  if (!playing && energyLevel > 0) {
    energyLevel = Math.max(0, energyLevel - 0.1);
  }
}

// Main game loop
function gameLoop() {
  const currentTime = Date.now() - startTime;
  updateGameState();
  drawRoom();
  drawDancingPeople(currentTime);
  drawDJBooth();
  requestAnimationFrame(gameLoop);
}
gameLoop();

// DJ control event listeners
playButton.addEventListener("click", () => {
  playing = true;
  energyLevel = Math.min(maxEnergy, energyLevel + 15);
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
