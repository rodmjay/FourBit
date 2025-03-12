# Chord Progression Detector

This game uses librosa to analyze audio files and detect chord progressions. It provides a web interface for uploading audio files and visualizing the detected chords and chromagram.

## Features

- Upload and analyze audio files
- Detect major and minor chords
- Visualize chromagram using Chart.js
- Play audio files in the browser

## Technologies Used

- Python (Flask, Librosa)
- HTML/CSS/JavaScript
- Chart.js for visualization

## Setup

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the Flask application:
   ```
   python app.py
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## How It Works

The application uses the Librosa library to:
1. Load audio files
2. Compute a chromagram (showing the intensity of each pitch class over time)
3. Compare each frame's chroma vector with chord templates
4. Identify the most likely chord for each frame

The results are displayed in the web interface, showing the detected chord progression and a visualization of the chromagram.
