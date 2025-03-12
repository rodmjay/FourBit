// Games/Game3/main.ts
// Using relative import for the SDK
import { logHello, getGreeting } from "../../SDK/src/shared";

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
