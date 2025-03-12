// Get references to the canvas and DJ control buttons
var canvas = document.getElementById("roomCanvas");
var ctx = canvas.getContext("2d");
var playButton = document.getElementById("playButton");
var stopButton = document.getElementById("stopButton");
var mixButton = document.getElementById("mixButton");
// Resize the canvas to fill its container
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
// Game state variables
var energyLevel = 0; // Energy level increases with music play
var maxEnergy = 100;
var playing = false;
// Function to draw the room from the DJ's perspective
function drawRoom() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw a gradient background simulating room depth
    var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#444");
    gradient.addColorStop(1, "#222");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw perspective lines to simulate depth (e.g., floor tiles)
    var numLines = 10;
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;
    for (var i = 1; i < numLines; i++) {
        var y = (canvas.height / numLines) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    // Draw the crowd as a row of circles reacting to energyLevel
    var numPeople = 10;
    var spacing = canvas.width / (numPeople + 1);
    for (var i = 1; i <= numPeople; i++) {
        var baseRadius = 15;
        var radius = baseRadius + (energyLevel / maxEnergy) * 10;
        // Adjust color based on energy level
        var colorIntensity = Math.min(255, Math.floor((energyLevel / maxEnergy) * 255));
        ctx.fillStyle = "rgb(".concat(colorIntensity, ", ").concat(255 - colorIntensity, ", 0)");
        // Position the crowd toward the top (simulate a room view)
        var x = i * spacing;
        var y = canvas.height * 0.3; // 30% from the top
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
playButton.addEventListener("click", function () {
    playing = true;
    energyLevel = Math.min(maxEnergy, energyLevel + 15);
    // (Optionally, integrate real audio playback here.)
});
stopButton.addEventListener("click", function () {
    playing = false;
});
mixButton.addEventListener("click", function () {
    energyLevel = Math.min(maxEnergy, energyLevel + 10);
});
// Also add a key listener for additional interaction (e.g., space bar)
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        playing = true;
        energyLevel = Math.min(maxEnergy, energyLevel + 15);
    }
});
