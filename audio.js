// ── Web Audio Engine ──────────────────────────────────────────────────────────
// All sounds are generated programmatically — no audio files required.
// The AudioContext is created lazily on the first user interaction to satisfy
// browser autoplay policies.

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let ctx = null;
let masterGain = null;
let isMuted = false;

// Create (or resume) the audio context. Must be called inside a user gesture.
function init() {
    if (ctx) {
        if (ctx.state === 'suspended') ctx.resume();
        return;
    }
    ctx = new AudioCtx();
    masterGain = ctx.createGain();
    masterGain.gain.value = isMuted ? 0 : 0.8;
    masterGain.connect(ctx.destination);
}

// Schedule a single oscillator tone.
function tone(freq, type, start, duration, vol) {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(start);
    osc.stop(start + duration + 0.05);
}

// ── Sound Effects ─────────────────────────────────────────────────────────────

// Short soft click when a card is selected.
export function playCardSelect() {
    init();
    const t = ctx.currentTime;
    tone(900, 'sine', t, 0.07, 0.12);
}

// Impact thud when the Fight button is clicked.
export function playFight() {
    init();
    const t = ctx.currentTime;
    tone(120, 'sawtooth', t,        0.12, 0.35);
    tone(180, 'sine',     t + 0.04, 0.08, 0.20);
}

// Ascending arpeggio for winning a round (C4 → E4 → G4).
export function playWin() {
    init();
    const t = ctx.currentTime;
    tone(261.63, 'sine', t,       0.15, 0.30);
    tone(329.63, 'sine', t + 0.1, 0.15, 0.30);
    tone(392.00, 'sine', t + 0.2, 0.20, 0.40);
}

// Descending tone for losing a round (G4 → E4 → C4).
export function playLose() {
    init();
    const t = ctx.currentTime;
    tone(392.00, 'sine', t,       0.15, 0.25);
    tone(329.63, 'sine', t + 0.1, 0.15, 0.25);
    tone(261.63, 'sine', t + 0.2, 0.20, 0.30);
}

// Flat single note for a tie.
export function playTie() {
    init();
    const t = ctx.currentTime;
    tone(440, 'triangle', t, 0.18, 0.18);
}

// Four-note victory fanfare (C4 → E4 → G4 → C5).
export function playVictory() {
    init();
    const t = ctx.currentTime;
    tone(261.63, 'square', t,        0.18, 0.35);
    tone(329.63, 'square', t + 0.14, 0.18, 0.35);
    tone(392.00, 'square', t + 0.28, 0.18, 0.35);
    tone(523.25, 'square', t + 0.42, 0.55, 0.45);
}

// Descending defeat motif (G4 → F4 → E4 → C4).
export function playDefeat() {
    init();
    const t = ctx.currentTime;
    tone(392.00, 'sine', t,        0.28, 0.22);
    tone(349.23, 'sine', t + 0.22, 0.28, 0.22);
    tone(329.63, 'sine', t + 0.44, 0.28, 0.22);
    tone(261.63, 'sine', t + 0.66, 0.60, 0.28);
}

// ── Background Music ──────────────────────────────────────────────────────────
// A quiet C-major arpeggio loop (C3 → E3 → G3 → E3) playing as ambient music.
// Volume is kept low so it does not compete with sound effects.

const MUSIC_NOTES = [130.81, 164.81, 196.00, 164.81]; // C3 E3 G3 E3
const STEP_MS     = 550; // milliseconds per note
let musicTimer    = null;
let musicStep     = 0;

function playMusicStep() {
    if (!ctx || isMuted) return;
    const t    = ctx.currentTime;
    const freq = MUSIC_NOTES[musicStep % MUSIC_NOTES.length];
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + STEP_MS / 1000 * 0.85);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t);
    osc.stop(t + STEP_MS / 1000);
    musicStep++;
}

export function startMusic() {
    init();
    if (musicTimer) return;
    playMusicStep();
    musicTimer = setInterval(playMusicStep, STEP_MS);
}

export function stopMusic() {
    if (musicTimer) {
        clearInterval(musicTimer);
        musicTimer = null;
    }
    musicStep = 0;
}

// ── Mute Toggle ───────────────────────────────────────────────────────────────
export function toggleMute() {
    isMuted = !isMuted;
    if (masterGain) {
        masterGain.gain.value = isMuted ? 0 : 0.8;
    }
    return isMuted;
}

export function getMuted() {
    return isMuted;
}
