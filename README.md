# FourBit

A solution with a shared SDK and multiple game projects.

## Project Structure

```
MyRepo/
├── SDK/                      # Shared TypeScript SDK
│   ├── package.json          # SDK package configuration
│   ├── tsconfig.json         # TypeScript configuration for the shared code
│   └── src/
│       └── shared.ts         # Shared functions that games can import
└── Games/                    # Collection of game projects
    ├── Game1/                # First game project
    │   ├── index.html        # HTML file with "Hello World" message
    │   ├── style.css         # CSS styles
    │   └── main.ts           # Game-specific TypeScript code
    ├── Game2/                # Second game project
    │   ├── index.html
    │   ├── style.css
    │   └── main.ts
    └── Game3/                # Third game project
        ├── index.html
        ├── style.css
        └── main.ts
```

## Shared SDK

The SDK provides common functionality that can be used across all games:

- `logHello()`: Logs a hello message to the console
- `getGreeting(gameName)`: Returns a formatted greeting message
- `formatScore(score)`: Formats a score for display
- `createElement(tag, className, text)`: Utility to create DOM elements

## Building the Projects

To build all projects:

```bash
npm install
npm run build
```

This will compile the SDK and all game projects.

## Running the Games

Open any of the game HTML files in a web browser to see the "Hello World" message.
