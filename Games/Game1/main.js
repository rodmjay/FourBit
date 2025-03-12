// Global variable for the selected module.
window.selectedModule = null;

/* ----------------------------
   Synth Interaction Component
---------------------------- */
AFRAME.registerComponent('synth-interaction', {
  schema: {
    note: { type: 'string', default: 'C4' },
    synthType: { type: 'string', default: 'synth' },
    effects: { type: 'string', default: '' },
    reverbWet: { type: 'number', default: 0.5 },
    distortionWet: { type: 'number', default: 0.5 },
    reverbPreset: { type: 'string', default: 'smallHall' },
    distortionPreset: { type: 'string', default: 'light' }
  },
  init: function () {
    const el = this.el;
    const note = this.data.note;
    const synthType = this.data.synthType;
    const effectsString = this.data.effects;
    let synth;
    
    // Create a basic synth based on type.
    if (synthType === 'synth') {
      synth = new Tone.Synth();
    } else if (synthType === 'membrane') {
      synth = new Tone.MembraneSynth();
    } else if (synthType === 'fm') {
      synth = new Tone.FMSynth();
    } else if (synthType === 'am') {
      synth = new Tone.AMSynth();
    } else if (synthType === 'metal') {
      synth = new Tone.MetalSynth();
    } else {
      synth = new Tone.Synth();
    }
    
    // Build effects chain if requested.
    if (effectsString && effectsString.trim() !== '') {
      const effectNames = effectsString.split(',').map(e => e.trim().toLowerCase());
      const effectsChain = [];
      effectNames.forEach(effect => {
        if (effect === 'reverb') {
          let reverbOptions;
          switch (this.data.reverbPreset) {
            case 'smallHall': reverbOptions = { decay: 1.5, preDelay: 0.2 }; break;
            case 'largeHall': reverbOptions = { decay: 3, preDelay: 0.5 }; break;
            case 'plate': reverbOptions = { decay: 2.5, preDelay: 0.3 }; break;
            default: reverbOptions = { decay: 1.5, preDelay: 0.2 };
          }
          let reverb = new Tone.Reverb(Object.assign({}, reverbOptions, { wet: this.data.reverbWet }));
          effectsChain.push(reverb);
        } else if (effect === 'distortion') {
          let distortionAmount;
          switch (this.data.distortionPreset) {
            case 'light': distortionAmount = 0.3; break;
            case 'medium': distortionAmount = 0.6; break;
            case 'heavy': distortionAmount = 0.9; break;
            default: distortionAmount = 0.3;
          }
          let distortion = new Tone.Distortion(distortionAmount);
          distortion.wet.value = this.data.distortionWet;
          effectsChain.push(distortion);
        }
      });
      if (effectsChain.length > 0) {
        synth.chain(...effectsChain, Tone.Destination);
      } else {
        synth.toDestination();
      }
    } else {
      synth.toDestination();
    }
    this.synth = synth;
    
    // Ensure the Tone.js audio context is running.
    const startAudio = async () => {
      if (Tone.context.state !== 'running') {
        await Tone.start();
        console.log('Audio context started');
      }
    };
    
    // When clicked, play the note and mark this module as selected.
    const handleInteraction = async function () {
      await startAudio();
      synth.triggerAttackRelease(note, "8n");
      el.setAttribute('animation__click', {
        property: 'scale',
        to: '1.2 1.2 1.2',
        dur: 150,
        easing: 'easeInOutQuad',
        loop: false,
        dir: 'alternate'
      });
      window.selectedModule = el;
    };
    
    el.addEventListener('click', handleInteraction);
    el.addEventListener('mousedown', handleInteraction);
  }
});

/* ----------------------------
   Drum Sequencer Component
---------------------------- */
AFRAME.registerComponent('drum-sequencer', {
  schema: {
    effects: { type: 'string', default: '' },
    reverbWet: { type: 'number', default: 0.5 },
    distortionWet: { type: 'number', default: 0.5 },
    reverbPreset: { type: 'string', default: 'smallHall' },
    distortionPreset: { type: 'string', default: 'light' },
    kickSample: { type: 'string', default: 'kick1' },
    snareSample: { type: 'string', default: 'snare1' },
    hihatSample: { type: 'string', default: 'hihat1' }
  },
  init: function() {
    const el = this.el;
    el.addEventListener('click', function() {
      window.selectedModule = el;
    });
    
    this.drumPattern = {
      kick: Array(16).fill(false),
      snare: Array(16).fill(false),
      hihat: Array(16).fill(false)
    };
    
    // Define sample URLs (using Tone.js provided samples).
    const kickSamples = {
      'kick1': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3',
      'kick2': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3',
      'kick3': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3',
      'kick4': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3',
      'kick5': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3'
    };
    const snareSamples = {
      'snare1': 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
      'snare2': 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
      'snare3': 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
      'snare4': 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
      'snare5': 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3'
    };
    const hihatSamples = {
      'hihat1': 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3',
      'hihat2': 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3',
      'hihat3': 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3',
      'hihat4': 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3',
      'hihat5': 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3'
    };
    
    this.kickPlayer = new Tone.Player(kickSamples[this.data.kickSample]);
    this.snarePlayer = new Tone.Player(snareSamples[this.data.snareSample]);
    this.hihatPlayer = new Tone.Player(hihatSamples[this.data.hihatSample]);
    
    this.drumGain = new Tone.Gain(1);
    
    this.updateEffects();
    
    this.kickPlayer.connect(this.drumGain);
    this.snarePlayer.connect(this.drumGain);
    this.hihatPlayer.connect(this.drumGain);
    
    this.sequence = new Tone.Sequence((time, step) => {
      if (this.drumPattern.kick[step]) { this.kickPlayer.start(time); }
      if (this.drumPattern.snare[step]) { this.snarePlayer.start(time); }
      if (this.drumPattern.hihat[step]) { this.hihatPlayer.start(time); }
    }, [...Array(16).keys()], "16n");
    this.sequenceStarted = false;
  },
  update: function(oldData) {
    this.updateEffects();
    this.updatePlayers();
  },
  updateEffects: function() {
    this.drumGain.disconnect();
    if (this.data.effects && this.data.effects.trim() !== '') {
      const effectNames = this.data.effects.split(',').map(e => e.trim().toLowerCase());
      const effectsChain = [];
      effectNames.forEach(effect => {
        if (effect === 'reverb') {
          let reverbOptions;
          switch (this.data.reverbPreset) {
            case 'smallHall': reverbOptions = { decay: 1.5, preDelay: 0.2 }; break;
            case 'largeHall': reverbOptions = { decay: 3, preDelay: 0.5 }; break;
            case 'plate': reverbOptions = { decay: 2.5, preDelay: 0.3 }; break;
            default: reverbOptions = { decay: 1.5, preDelay: 0.2 };
          }
          let reverb = new Tone.Reverb(Object.assign({}, reverbOptions, { wet: this.data.reverbWet }));
          effectsChain.push(reverb);
        } else if (effect === 'distortion') {
          let distortionAmount;
          switch (this.data.distortionPreset) {
            case 'light': distortionAmount = 0.3; break;
            case 'medium': distortionAmount = 0.6; break;
            case 'heavy': distortionAmount = 0.9; break;
            default: distortionAmount = 0.3;
          }
          let distortion = new Tone.Distortion(distortionAmount);
          distortion.wet.value = this.data.distortionWet;
          effectsChain.push(distortion);
        }
      });
      if (effectsChain.length > 0) {
        this.drumGain.chain(...effectsChain, Tone.Destination);
      } else {
        this.drumGain.toDestination();
      }
    } else {
      this.drumGain.toDestination();
    }
  },
  updatePlayers: function() {
    const kickSamples = {
      'kick1': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3',
      'kick2': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3',
      'kick3': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3',
      'kick4': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3',
      'kick5': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3'
    };
    const snareSamples = {
      'snare1': 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
      'snare2': 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
      'snare3': 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
      'snare4': 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
      'snare5': 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3'
    };
    const hihatSamples = {
      'hihat1': 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3',
      'hihat2': 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3',
      'hihat3': 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3',
      'hihat4': 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3',
      'hihat5': 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3'
    };
    this.kickPlayer.load(kickSamples[this.data.kickSample]);
    this.snarePlayer.load(snareSamples[this.data.snareSample]);
    this.hihatPlayer.load(hihatSamples[this.data.hihatSample]);
  },
  playSequence: function() {
    Tone.start();
    this.sequence.start(0);
    Tone.Transport.start();
    this.sequenceStarted = true;
  },
  stopSequence: function() {
    this.sequence.stop();
    Tone.Transport.stop();
    this.sequenceStarted = false;
  }
});

/* ----------------------------------
   Configuration Overlay Handling
---------------------------------- */
document.addEventListener('keydown', function(e) {
  if (e.key === 'e' || e.key === 'E') {
    if (window.selectedModule) {
      document.getElementById('config-overlay').style.display = 'block';
      if (window.selectedModule.components['synth-interaction']) {
        document.getElementById('drum-config').style.display = 'none';
        let comp = window.selectedModule.getAttribute('synth-interaction');
        document.getElementById('config-reverb-checkbox').checked = comp.effects.includes('reverb');
        document.getElementById('config-distortion-checkbox').checked = comp.effects.includes('distortion');
        document.getElementById('config-reverb-wet').value = comp.reverbWet;
        document.getElementById('config-distortion-wet').value = comp.distortionWet;
        document.getElementById('config-reverb-preset').value = comp.reverbPreset;
        document.getElementById('config-distortion-preset').value = comp.distortionPreset;
      } else if (window.selectedModule.components['drum-sequencer']) {
        document.getElementById('drum-config').style.display = 'block';
        let comp = window.selectedModule.getAttribute('drum-sequencer');
        document.getElementById('config-reverb-checkbox').checked = comp.effects.includes('reverb');
        document.getElementById('config-distortion-checkbox').checked = comp.effects.includes('distortion');
        document.getElementById('config-reverb-wet').value = comp.reverbWet;
        document.getElementById('config-distortion-wet').value = comp.distortionWet;
        document.getElementById('config-reverb-preset').value = comp.reverbPreset;
        document.getElementById('config-distortion-preset').value = comp.distortionPreset;
        for (let i = 0; i < 16; i++) {
          document.getElementById('drum-kick-step-' + i).checked = window.selectedModule.components['drum-sequencer'].drumPattern.kick[i];
          document.getElementById('drum-snare-step-' + i).checked = window.selectedModule.components['drum-sequencer'].drumPattern.snare[i];
          document.getElementById('drum-hihat-step-' + i).checked = window.selectedModule.components['drum-sequencer'].drumPattern.hihat[i];
        }
        document.getElementById('drum-kick-sample').value = comp.kickSample;
        document.getElementById('drum-snare-sample').value = comp.snareSample;
        document.getElementById('drum-hihat-sample').value = comp.hihatSample;
      }
    }
  }
});

function closeConfig() {
  document.getElementById('config-overlay').style.display = 'none';
}

function saveConfig() {
  if (!window.selectedModule) return;
  if (window.selectedModule.components['synth-interaction']) {
    let compName = "synth-interaction";
    let effects = [];
    if (document.getElementById('config-reverb-checkbox').checked) {
      effects.push("reverb");
    }
    if (document.getElementById('config-distortion-checkbox').checked) {
      effects.push("distortion");
    }
    const newConfig = {
      effects: effects.join(','),
      reverbWet: parseFloat(document.getElementById('config-reverb-wet').value),
      distortionWet: parseFloat(document.getElementById('config-distortion-wet').value),
      reverbPreset: document.getElementById('config-reverb-preset').value,
      distortionPreset: document.getElementById('config-distortion-preset').value
    };
    window.selectedModule.setAttribute(compName, newConfig);
  } else if (window.selectedModule.components['drum-sequencer']) {
    let compName = "drum-sequencer";
    let effects = [];
    if (document.getElementById('config-reverb-checkbox').checked) {
      effects.push("reverb");
    }
    if (document.getElementById('config-distortion-checkbox').checked) {
      effects.push("distortion");
    }
    const newConfig = {
      effects: effects.join(','),
      reverbWet: parseFloat(document.getElementById('config-reverb-wet').value),
      distortionWet: parseFloat(document.getElementById('config-distortion-wet').value),
      reverbPreset: document.getElementById('config-reverb-preset').value,
      distortionPreset: document.getElementById('config-distortion-preset').value,
      kickSample: document.getElementById('drum-kick-sample').value,
      snareSample: document.getElementById('drum-snare-sample').value,
      hihatSample: document.getElementById('drum-hihat-sample').value
    };
    window.selectedModule.setAttribute(compName, newConfig);
    let newPattern = { kick: [], snare: [], hihat: [] };
    for (let i = 0; i < 16; i++) {
      newPattern.kick.push(document.getElementById('drum-kick-step-' + i).checked);
      newPattern.snare.push(document.getElementById('drum-snare-step-' + i).checked);
      newPattern.hihat.push(document.getElementById('drum-hihat-step-' + i).checked);
    }
    window.selectedModule.components['drum-sequencer'].drumPattern = newPattern;
  }
  closeConfig();
}

function updateDrumPattern() {
  if (window.selectedModule && window.selectedModule.components['drum-sequencer']) {
    let pattern = { kick: [], snare: [], hihat: [] };
    for (let i = 0; i < 16; i++) {
      pattern.kick.push(document.getElementById('drum-kick-step-' + i).checked);
      pattern.snare.push(document.getElementById('drum-snare-step-' + i).checked);
      pattern.hihat.push(document.getElementById('drum-hihat-step-' + i).checked);
    }
    window.selectedModule.components['drum-sequencer'].drumPattern = pattern;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  for (let i = 0; i < 16; i++) {
    document.getElementById('drum-kick-step-' + i).addEventListener('change', updateDrumPattern);
    document.getElementById('drum-snare-step-' + i).addEventListener('change', updateDrumPattern);
    document.getElementById('drum-hihat-step-' + i).addEventListener('change', updateDrumPattern);
  }
  document.getElementById('drum-play-button').addEventListener('click', function(){
    if(window.selectedModule && window.selectedModule.components['drum-sequencer']){
      window.selectedModule.components['drum-sequencer'].playSequence();
    }
  });
  document.getElementById('drum-stop-button').addEventListener('click', function(){
    if(window.selectedModule && window.selectedModule.components['drum-sequencer']){
      window.selectedModule.components['drum-sequencer'].stopSequence();
    }
  });
});
