// Games/Game1/main.ts
import { logHello, getGreeting, createElement } from "../../SDK/src/shared";

// Log hello message to console
logHello();
console.log("Hello from Game 1 main.ts!");

// Display greeting in the UI
document.addEventListener("DOMContentLoaded", () => {
    const messageElement = document.getElementById("message");
    if (messageElement) {
        messageElement.textContent = getGreeting("Game 1");
    }
});
