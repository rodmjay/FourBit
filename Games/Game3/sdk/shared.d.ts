/**
 * Shared SDK functions for FourBit games
 */
/**
 * Logs a hello message to the console
 */
export declare function logHello(): void;
/**
 * Returns a formatted greeting message
 * @param gameName The name of the game
 * @returns A formatted greeting string
 */
export declare function getGreeting(gameName: string): string;
/**
 * Simple utility to format a score display
 * @param score Current score value
 * @returns Formatted score string
 */
export declare function formatScore(score: number): string;
/**
 * Utility to create a DOM element with specified properties
 * @param tag HTML element tag
 * @param className Optional CSS class name
 * @param text Optional text content
 * @returns The created HTML element
 */
export declare function createElement<T extends HTMLElement>(tag: string, className?: string, text?: string): T;
