import os
import librosa
import numpy as np
from app import get_chord_templates, detect_chord

# Test with a sample audio file
audio_path = 'static/audio/c_major_chord.wav'
if os.path.exists(audio_path):
    # Load audio file
    y, sr = librosa.load(audio_path, sr=22050)
    # Compute chromagram
    chromagram = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=512)
    
    # Get chord templates
    chord_templates = get_chord_templates()
    
    # Test chord detection on first frame
    first_frame = chromagram.T[0]
    detected_chord = detect_chord(first_frame, chord_templates)
    
    print(f'Testing chord detection on {audio_path}')
    print(f'Detected chord: {detected_chord}')
    print('Chromagram shape:', chromagram.shape)
    print('Test successful!')
else:
    print(f'Error: Audio file {audio_path} not found')
