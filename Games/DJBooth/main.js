// Import the room module
import { drawRoom } from "./room.js";
// Get references to the canvas and DJ control buttons
const canvas = document.getElementById("roomCanvas");
const ctx = canvas.getContext("2d");
const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");
const mixButton = document.getElementById("mixButton");
// Resize the canvas to fill its container
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
// Global game state
let energyLevel = 0; // increases when music is played
const maxEnergy = 100;
let playing = false;
let startTime = Date.now();
// Create an array of block people placed along the floor
const numPeople = 8;
const people = [];
for (let i = 0; i < numPeople; i++) {
    const person = {
        x: canvas.width * (0.2 + 0.6 * (i / (numPeople - 1))), // evenly spaced horizontally
        baseWidth: 20,
        baseHeight: 40,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16)
    };
    people.push(person);
}
function drawDancingPeople(time) {
    const baseY = canvas.height * 0.5;
    for (const person of people) {
        const danceFactor = Math.abs(Math.sin((time + person.x) * 0.005));
        const offsetY = danceFactor * 10 * (energyLevel / maxEnergy);
        const headRadius = 8;
        const torsoHeight = person.baseHeight;
        const torsoWidth = person.baseWidth;
        const armWidth = 5;
        const armLength = torsoHeight * 0.5;
        const legLength = 20 + danceFactor * 10;
        const headX = person.x;
        const headY = baseY - (torsoHeight + headRadius * 2 + offsetY);
        const torsoX = person.x - torsoWidth / 2;
        const torsoY = headY + headRadius * 2;
        const armSwing = Math.sin((time + person.x) * 0.01) * 5;
        const leftArmX = torsoX - armWidth;
        const rightArmX = torsoX + torsoWidth;
        const armsY = torsoY + 10;
        const legSwing = Math.cos((time + person.x) * 0.01) * 3;
        const leftLegX = person.x - armWidth - 2;
        const rightLegX = person.x + 2;
        const legY = baseY;
        // Draw head
        ctx.fillStyle = person.color;
        ctx.beginPath();
        ctx.arc(headX, headY + headRadius, headRadius, 0, Math.PI * 2);
        ctx.fill();
        // Draw torso
        ctx.fillStyle = person.color;
        ctx.fillRect(torsoX, torsoY, torsoWidth, torsoHeight);
        // Draw left arm
        ctx.fillRect(leftArmX, armsY + armSwing, armWidth, armLength);
        // Draw right arm
        ctx.fillRect(rightArmX, armsY - armSwing, armWidth, armLength);
        // Draw left leg
        ctx.fillRect(leftLegX, legY, armWidth, legLength);
        // Draw right leg
        ctx.fillRect(rightLegX, legY, armWidth, legLength);
    }
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
    // Use the room module to draw the room
    drawRoom(ctx, canvas);
    // Draw dancing people on top of the room
    drawDancingPeople(currentTime);
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
//# sourceMappingURL=main.js.map