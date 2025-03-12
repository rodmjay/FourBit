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
// Global game state
var energyLevel = 0; // Increases when music is played
var maxEnergy = 100;
var playing = false;
var startTime = Date.now();
// Create an array of block people placed along the floor
var numPeople = 8;
var people = [];
for (var i = 0; i < numPeople; i++) {
    var person = {
        x: canvas.width * (0.2 + 0.6 * (i / (numPeople - 1))), // evenly spaced horizontally
        baseWidth: 20,
        baseHeight: 40,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16)
    };
    people.push(person);
}
// Function to draw the room with perspective
function drawRoom() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Define the floor as a trapezoid
    var floorTopY = canvas.height * 0.5;
    ctx.fillStyle = "#444";
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.1, floorTopY);
    ctx.lineTo(canvas.width * 0.9, floorTopY);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    // Draw left wall as a trapezoid
    ctx.fillStyle = "#555";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width * 0.1, floorTopY);
    ctx.lineTo(canvas.width * 0.1, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    // Draw right wall as a trapezoid
    ctx.fillStyle = "#555";
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width * 0.9, floorTopY);
    ctx.lineTo(canvas.width * 0.9, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
    // Draw the ceiling as a light rectangle on the top portion
    ctx.fillStyle = "#666";
    ctx.fillRect(0, 0, canvas.width, floorTopY * 0.8);
    // Optionally, add perspective lines on the floor to enhance depth
    var numLines = 10;
    ctx.strokeStyle = "#777";
    ctx.lineWidth = 1;
    for (var i = 1; i < numLines; i++) {
        var y = floorTopY + ((canvas.height - floorTopY) / numLines) * i;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.1, y);
        ctx.lineTo(canvas.width * 0.9, y);
        ctx.stroke();
    }
}
// Function to draw dancing block people on the floor
function drawDancingPeople(time) {
    for (var _i = 0, people_1 = people; _i < people_1.length; _i++) {
        var person = people_1[_i];
        // Use a sine wave to simulate dancing (jumping up and down)
        var danceFactor = Math.abs(Math.sin((time + person.x) * 0.005));
        var height = person.baseHeight + danceFactor * 20 * (energyLevel / maxEnergy);
        var width = person.baseWidth;
        // Position the person on the floor (just above the floor top)
        var y = canvas.height * 0.5 - height;
        ctx.fillStyle = person.color;
        ctx.fillRect(person.x - width / 2, y, width, height);
    }
}
// Function to draw the DJ booth with perspective
function drawDJBooth() {
    // The DJ booth is drawn as a trapezoid in the bottom center
    var boothHeight = 80;
    var boothWidthTop = 200;
    var boothWidthBottom = 300;
    var centerX = canvas.width / 2;
    var bottomY = canvas.height;
    var topY = bottomY - boothHeight;
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
    var currentTime = Date.now() - startTime;
    updateGameState();
    drawRoom();
    drawDancingPeople(currentTime);
    drawDJBooth();
    requestAnimationFrame(gameLoop);
}
gameLoop();
// DJ control event listeners
playButton.addEventListener("click", function () {
    playing = true;
    energyLevel = Math.min(maxEnergy, energyLevel + 15);
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
