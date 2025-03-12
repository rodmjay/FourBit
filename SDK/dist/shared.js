/**
 * Shared SDK functions for FourBit games
 */
/**
 * Logs a hello message to the console
 */
export function logHello() {
    console.log("Hello from the shared SDK!");
}
/**
 * Returns a formatted greeting message
 * @param gameName The name of the game
 * @returns A formatted greeting string
 */
export function getGreeting(gameName) {
    return `Welcome to ${gameName}!`;
}
/**
 * Simple utility to format a score display
 * @param score Current score value
 * @returns Formatted score string
 */
export function formatScore(score) {
    return `Score: ${score.toLocaleString()}`;
}
/**
 * Utility to create a DOM element with specified properties
 * @param tag HTML element tag
 * @param className Optional CSS class name
 * @param text Optional text content
 * @returns The created HTML element
 */
export function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className)
        element.className = className;
    if (text)
        element.textContent = text;
    return element;
}
//# sourceMappingURL=shared.js.map