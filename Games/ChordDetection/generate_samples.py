import numpy as np
from scipy.io import wavfile
import os

# Create directory if it doesn't exist
os.makedirs('static/audio', exist_ok=True)

# Sample rate
sr = 44100

# Duration in seconds
duration = 3

# Generate time array
t = np.linspace(0, duration, int(sr * duration), False)

# Frequencies for C major chord (C4, E4, G4)
c_freq = 261.63  # C4
e_freq = 329.63  # E4
g_freq = 392.00  # G4

# Generate sine waves for each note
c_note = 0.3 * np.sin(2 * np.pi * c_freq * t)
e_note = 0.3 * np.sin(2 * np.pi * e_freq * t)
g_note = 0.3 * np.sin(2 * np.pi * g_freq * t)

# Combine notes to form a chord
chord = c_note + e_note + g_note

# Normalize to prevent clipping
chord = chord / np.max(np.abs(chord))

# Convert to 16-bit PCM
chord_int16 = (chord * 32767).astype(np.int16)

# Save as WAV file
wavfile.write('static/audio/c_major_chord.wav', sr, chord_int16)

# Generate A minor chord (A, C, E)
a_freq = 220.00  # A3
c_freq = 261.63  # C4
e_freq = 329.63  # E4

a_note = 0.3 * np.sin(2 * np.pi * a_freq * t)
c_note = 0.3 * np.sin(2 * np.pi * c_freq * t)
e_note = 0.3 * np.sin(2 * np.pi * e_freq * t)

# Combine notes to form a chord
chord = a_note + c_note + e_note

# Normalize to prevent clipping
chord = chord / np.max(np.abs(chord))

# Convert to 16-bit PCM
chord_int16 = (chord * 32767).astype(np.int16)

# Save as WAV file
wavfile.write('static/audio/a_minor_chord.wav', sr, chord_int16)

# Generate a simple chord progression (C - G - Am - F)
progression = np.array([])

# C major (C, E, G)
c_freq, e_freq, g_freq = 261.63, 329.63, 392.00
c_note = 0.3 * np.sin(2 * np.pi * c_freq * t)
e_note = 0.3 * np.sin(2 * np.pi * e_freq * t)
g_note = 0.3 * np.sin(2 * np.pi * g_freq * t)
c_chord = (c_note + e_note + g_note) / 3

# G major (G, B, D)
g_freq, b_freq, d_freq = 392.00, 493.88, 587.33
g_note = 0.3 * np.sin(2 * np.pi * g_freq * t)
b_note = 0.3 * np.sin(2 * np.pi * b_freq * t)
d_note = 0.3 * np.sin(2 * np.pi * d_freq * t)
g_chord = (g_note + b_note + d_note) / 3

# A minor (A, C, E)
a_freq, c_freq, e_freq = 220.00, 261.63, 329.63
a_note = 0.3 * np.sin(2 * np.pi * a_freq * t)
c_note = 0.3 * np.sin(2 * np.pi * c_freq * t)
e_note = 0.3 * np.sin(2 * np.pi * e_freq * t)
a_chord = (a_note + c_note + e_note) / 3

# F major (F, A, C)
f_freq, a_freq, c_freq = 349.23, 440.00, 523.25
f_note = 0.3 * np.sin(2 * np.pi * f_freq * t)
a_note = 0.3 * np.sin(2 * np.pi * a_freq * t)
c_note = 0.3 * np.sin(2 * np.pi * c_freq * t)
f_chord = (f_note + a_note + c_note) / 3

# Combine into progression (1 second per chord)
samples_per_chord = sr
progression = np.concatenate([
    c_chord[:samples_per_chord], 
    g_chord[:samples_per_chord], 
    a_chord[:samples_per_chord], 
    f_chord[:samples_per_chord]
])

# Normalize to prevent clipping
progression = progression / np.max(np.abs(progression))

# Convert to 16-bit PCM
progression_int16 = (progression * 32767).astype(np.int16)

# Save as WAV file
wavfile.write('static/audio/chord_progression.wav', sr, progression_int16)

print('Sample audio files created successfully!')
