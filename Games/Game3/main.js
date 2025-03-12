// Games/Game3/main.js
import { logHello, getGreeting } from "./sdk/shared.js";

// Log hello message to console
logHello();
console.log("Hello from Game 3 main.ts!");

// Display greeting in the UI
document.addEventListener("DOMContentLoaded", () => {
    const messageElement = document.getElementById("message");
    if (messageElement) {
        messageElement.textContent = getGreeting("Game 3");
    }
});
