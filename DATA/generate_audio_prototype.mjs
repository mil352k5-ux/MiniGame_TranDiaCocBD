import fs from "node:fs/promises";

const rate = 44100;
const TAU = Math.PI * 2;

function envelope(t, attack = 0.01, release = 0.2, length = 1) {
  const a = Math.min(1, t / attack);
  const r = Math.min(1, Math.max(0, (length - t) / release));
  return Math.max(0, Math.min(a, r));
}

function noise(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function wavBuffer(samples) {
  const dataSize = samples.length * 2;
  const b = Buffer.alloc(44 + dataSize);
  b.write("RIFF", 0); b.writeUInt32LE(36 + dataSize, 4); b.write("WAVE", 8);
  b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(samples[i] * 32767))), 44 + i * 2);
  return b;
}

function tone(seconds, fn) {
  const n = Math.floor(seconds * rate);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = fn(i / rate, i);
  return out;
}

function saveMix(path, layers) {
  const n = Math.max(...layers.map((x) => x.length));
  const mix = new Float32Array(n);
  for (const layer of layers) for (let i = 0; i < layer.length; i++) mix[i] += layer[i];
  let peak = 0; for (const v of mix) peak = Math.max(peak, Math.abs(v));
  const gain = peak > 0.92 ? 0.92 / peak : 1;
  for (let i = 0; i < mix.length; i++) mix[i] *= gain;
  return fs.writeFile(path, wavBuffer(mix));
}

function drum() {
  const length = 1.2;
  const hit = tone(length, (t, i) => {
    const kick = Math.sin(TAU * (105 - 60 * Math.min(1, t / 0.24)) * t) * Math.exp(-8 * t);
    const slap = Math.sin(TAU * 180 * t) * Math.exp(-16 * Math.max(0, t - 0.18));
    const rattle = noise(i + 1) * Math.exp(-10 * Math.max(0, t - 0.26));
    return 0.84 * kick + 0.24 * slap + 0.12 * rattle;
  });
  return hit;
}

function lobby() {
  const seconds = 16;
  const notes = [261.63, 293.66, 329.63, 392, 440, 523.25];
  const pad = tone(seconds, (t) => {
    const beat = Math.floor(t / 2) % 4;
    const root = [notes[0], notes[2], notes[3], notes[1]][beat];
    return 0.11 * Math.sin(TAU * root * t) + 0.07 * Math.sin(TAU * root * 1.5 * t) + 0.035 * Math.sin(TAU * root * 2 * t);
  });
  const pluck = tone(seconds, (t) => {
    const step = 0.5;
    const local = t % step;
    const n = Math.floor(t / step) % notes.length;
    return 0.2 * Math.sin(TAU * notes[n] * local) * envelope(local, 0.008, 0.22, step);
  });
  return [pad, pluck];
}

function gameplay() {
  const seconds = 16;
  const low = tone(seconds, (t) => 0.12 * Math.sin(TAU * 55 * t) * (0.55 + 0.45 * Math.sin(TAU * 2 * t)));
  const pulse = tone(seconds, (t, i) => {
    const beat = t % 0.5;
    const click = noise(i + 99) * Math.exp(-42 * beat);
    const kick = Math.sin(TAU * 85 * beat) * Math.exp(-18 * beat) * (Math.floor(t / 0.5) % 4 === 0 ? 1 : 0.45);
    return 0.18 * click + 0.24 * kick;
  });
  const motif = tone(seconds, (t) => {
    const step = 0.5;
    const local = t % step;
    const seq = [220, 246.94, 293.66, 329.63, 293.66, 246.94, 196, 220];
    const f = seq[Math.floor(t / step) % seq.length];
    return 0.14 * Math.sin(TAU * f * local) * envelope(local, 0.006, 0.18, step);
  });
  return [low, pulse, motif];
}

const root = new URL("../", import.meta.url).pathname.replace(/^\//, "").replaceAll("%20", " ");
const outDir = root.replace(/\\DATA\\?$/, "");
await fs.mkdir(`${outDir}SFX`, { recursive: true });
await fs.mkdir(`${outDir}BGM`, { recursive: true });
await fs.writeFile(`${outDir}SFX/vietnamese_drum_prototype.wav`, wavBuffer(drum()));
await saveMix(`${outDir}BGM/lobby_theme_prototype.wav`, lobby());
await saveMix(`${outDir}BGM/gameplay_theme_prototype.wav`, gameplay());
console.log("Generated original WAV prototypes.");
