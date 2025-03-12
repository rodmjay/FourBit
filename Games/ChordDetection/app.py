import os
import json
import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify, render_template, send_from_directory

app = Flask(__name__, static_folder='static')

def get_chord_templates():
    """
    Create chord templates for 12 major and 12 minor chords.
    Each template is a 12-dimensional binary vector indicating the presence of the root, third, and fifth.
    """
    # Major chord: root, major third, perfect fifth
    major_template = np.array([1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0])
    # Minor chord: root, minor third, perfect fifth
    minor_template = np.array([1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0])
    
    chords = {}
    notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    for i, note in enumerate(notes):
        chords[f"{note}maj"] = np.roll(major_template, i)
        chords[f"{note}min"] = np.roll(minor_template, i)
    return chords

def detect_chord(chroma_vector, chord_templates):
    """
    Given a chroma vector and chord templates, compute the cosine similarity
    with each template and return the chord name with the highest similarity.
    """
    similarities = {}
    for chord_name, template in chord_templates.items():
        # Normalize vectors to avoid scale issues
        norm_template = template / np.linalg.norm(template) if np.linalg.norm(template) != 0 else template
        norm_vector = chroma_vector / np.linalg.norm(chroma_vector) if np.linalg.norm(chroma_vector) != 0 else chroma_vector
        similarity = np.dot(norm_vector, norm_template)
        similarities[chord_name] = similarity
    # Return the chord with maximum similarity
    detected_chord = max(similarities, key=similarities.get)
    return detected_chord

def chord_recognition(audio_path, sr=22050, hop_length=512):
    """
    Load an audio file, compute its chromagram, and detect chords for each frame.
    """
    # Load audio file
    y, sr = librosa.load(audio_path, sr=sr)
    # Compute chromagram using Constant-Q Transform (better for musical data)
    chromagram = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop_length)
    
    # Get chord templates for comparison
    chord_templates = get_chord_templates()
    
    detected_chords = []
    # Iterate over each time frame
    for frame in chromagram.T:
        chord = detect_chord(frame, chord_templates)
        detected_chords.append(chord)
    
    # Return detected chords and chromagram
    return detected_chords, chromagram.tolist()

@app.route('/')
def index():
    # Make sure the audio directory exists
    os.makedirs('static/audio', exist_ok=True)
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    
    # Save the uploaded file temporarily
    temp_path = os.path.join('static/audio', 'temp_audio.wav')
    audio_file.save(temp_path)
    
    try:
        # Perform chord recognition
        chords, chromagram = chord_recognition(temp_path)
        
        # Simplify the results (take every 10th chord to reduce data size)
        simplified_chords = chords[::10]
        simplified_chromagram = [row[::10] for row in chromagram]
        
        # Return the results
        return jsonify({
            'chords': simplified_chords,
            'chromagram': simplified_chromagram
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    # Create the audio directory if it doesn't exist
    os.makedirs('static/audio', exist_ok=True)
    app.run(debug=True, port=5000)
