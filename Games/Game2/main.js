import { logHello, getGreeting } from "../../SDK/dist/shared.js";

// Log hello message to console
logHello();
console.log("Hello from Game2 main.ts!");

// Display greeting in the UI
document.addEventListener("DOMContentLoaded", () => {
    const messageElement = document.getElementById("message");
    if (messageElement) {
        messageElement.textContent = getGreeting("Game2");
    }
});
