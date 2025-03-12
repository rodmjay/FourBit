import os
import sys

# Check if the audio files exist
audio_files = [
    'static/audio/c_major_chord.wav',
    'static/audio/a_minor_chord.wav',
    'static/audio/chord_progression.wav'
]

all_exist = True
for file_path in audio_files:
    if os.path.exists(file_path):
        print(f"✓ {file_path} exists")
    else:
        print(f"✗ {file_path} does not exist")
        all_exist = False

# Check if the Flask app is properly configured
if os.path.exists('app.py'):
    print("✓ Flask app (app.py) exists")
else:
    print("✗ Flask app (app.py) does not exist")
    all_exist = False

if os.path.exists('templates/index.html'):
    print("✓ Flask template (templates/index.html) exists")
else:
    print("✗ Flask template (templates/index.html) does not exist")
    all_exist = False

if os.path.exists('static/js/main.js'):
    print("✓ JavaScript file (static/js/main.js) exists")
else:
    print("✗ JavaScript file (static/js/main.js) does not exist")
    all_exist = False

if os.path.exists('static/css/style.css'):
    print("✓ CSS file (static/css/style.css) exists")
else:
    print("✗ CSS file (static/css/style.css) does not exist")
    all_exist = False

if all_exist:
    print("\n✅ All required files exist. The chord detection game is ready for testing.")
    sys.exit(0)
else:
    print("\n❌ Some required files are missing. Please check the implementation.")
    sys.exit(1)
