// Games/Game3/main.ts
import { logHello, getGreeting } from "../../SDK/src/shared";

// Log hello message to console
logHello();
console.log("Hello from Game3 main.ts!");

// Display greeting in the UI
document.addEventListener("DOMContentLoaded", () => {
    const messageElement = document.getElementById("message");
    if (messageElement) {
        messageElement.textContent = getGreeting("Game3");
    }
});
