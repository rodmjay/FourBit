// Games/Game2/main.js
import { logHello, getGreeting } from "../../SDK/dist/src/shared.js";

// Log hello message to console
logHello();
console.log("Hello from Game 2 main.ts!");

// Display greeting in the UI
document.addEventListener("DOMContentLoaded", () => {
    const messageElement = document.getElementById("message");
    if (messageElement) {
        messageElement.textContent = getGreeting("Game 2");
    }
});
