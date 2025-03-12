// DOM Elements
const audioFileInput = document.getElementById('audioFileInput');
const analyzeButton = document.getElementById('analyzeButton');
const audioPlayer = document.getElementById('audioPlayer');
const chordResults = document.getElementById('chordResults');
const chromagramCanvas = document.getElementById('chromagramCanvas');

// Global variables
let audioFile = null;
let chromagramChart = null;

// Initialize the application
function init() {
    // Add event listeners
    audioFileInput.addEventListener('change', handleFileSelect);
    analyzeButton.addEventListener('click', analyzeAudio);
    
    // Add event listeners for sample links
    document.querySelectorAll('.sample-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            loadSampleAudio(this.href);
        });
    });
    
    // Disable analyze button initially
    analyzeButton.disabled = true;
}

// Handle file selection
function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        audioFile = files[0];
        
        // Create object URL for the audio player
        const audioURL = URL.createObjectURL(audioFile);
        audioPlayer.src = audioURL;
        
        // Enable analyze button
        analyzeButton.disabled = false;
        
        // Reset results
        chordResults.innerHTML = '<p>Click "Analyze Chords" to detect the chord progression</p>';
        
        // If there's an existing chart, destroy it
        if (chromagramChart) {
            chromagramChart.destroy();
            chromagramChart = null;
        }
    }
}

// Load sample audio file
function loadSampleAudio(url) {
    // Set the audio player source to the sample URL
    audioPlayer.src = url;
    
    // Create a fetch request to get the audio file
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            // Create a File object from the blob
            audioFile = new File([blob], url.split('/').pop(), { type: blob.type });
            
            // Enable analyze button
            analyzeButton.disabled = false;
            
            // Reset results
            chordResults.innerHTML = '<p>Sample audio loaded. Click "Analyze Chords" to detect the chord progression</p>';
            
            // If there's an existing chart, destroy it
            if (chromagramChart) {
                chromagramChart.destroy();
                chromagramChart = null;
            }
        })
        .catch(error => {
            console.error('Error loading sample audio:', error);
            chordResults.innerHTML = `<p>Error loading sample audio: ${error.message}</p>`;
        });
}

// Send audio file to server for analysis
function analyzeAudio() {
    if (!audioFile) {
        alert('Please select an audio file first');
        return;
    }
    
    // Show loading state
    chordResults.innerHTML = '<p>Analyzing chord progression... This may take a moment.</p>';
    
    // Create FormData object to send the file
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    // Send the file to the server
    fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayResults(data);
    })
    .catch(error => {
        console.error('Error:', error);
        chordResults.innerHTML = `<p>Error analyzing audio: ${error.message}</p>`;
    });
}

// Display the analysis results
function displayResults(data) {
    // Display detected chords
    const chords = data.chords;
    let chordsHTML = '<div class="chord-progression">';
    
    chords.forEach((chord, index) => {
        // Determine if it's a major or minor chord
        const chordClass = chord.includes('maj') ? 'chord-major' : 'chord-minor';
        chordsHTML += `<span class="chord-item ${chordClass}">${chord}</span>`;
        
        // Add a line break every 8 chords for readability
        if ((index + 1) % 8 === 0) {
            chordsHTML += '<br>';
        }
    });
    
    chordsHTML += '</div>';
    chordResults.innerHTML = chordsHTML;
    
    // Display chromagram visualization
    displayChromagram(data.chromagram);
}

// Display chromagram visualization using Chart.js
function displayChromagram(chromagramData) {
    const ctx = chromagramCanvas.getContext('2d');
    
    // If there's an existing chart, destroy it
    if (chromagramChart) {
        chromagramChart.destroy();
    }
    
    // Prepare data for Chart.js
    const labels = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const datasets = [];
    
    // Create a dataset for each time frame (column in the chromagram)
    for (let i = 0; i < chromagramData[0].length; i++) {
        const timeData = chromagramData.map(row => row[i]);
        
        datasets.push({
            label: `Frame ${i}`,
            data: timeData,
            borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
            backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
            borderWidth: 1,
            hidden: i > 0 // Only show the first frame by default
        });
    }
    
    // Create the chart
    chromagramChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
