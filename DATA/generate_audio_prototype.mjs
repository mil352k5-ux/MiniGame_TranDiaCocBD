import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rate = 44100;
const TAU = Math.PI * 2;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pentatonic = [146.83, 174.61, 196, 220, 261.63, 293.66, 329.63];

function env(t, length, attack = .02, release = .18) {
  return Math.max(0, Math.min(1, t / attack, (length - t) / release));
}
function pseudoNoise(i) { const x = Math.sin(i * 12.9898) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; }
function wave(type, phase) {
  if (type === "triangle") return 2 * Math.abs(2 * (phase / TAU - Math.floor(phase / TAU + .5))) - 1;
  if (type === "square") return Math.sin(phase) >= 0 ? 1 : -1;
  return Math.sin(phase);
}
function buffer(seconds) { return new Float32Array(Math.floor(seconds * rate)); }
function addTone(out, start, length, frequency, amplitude, type = "sine", vibrato = 0, glide = 0) {
  const from = Math.floor(start * rate), count = Math.floor(length * rate);
  for (let i = 0; i < count && from + i < out.length; i++) {
    const t = i / rate;
    const f = frequency * (1 + glide * t / length + vibrato * Math.sin(TAU * 5.2 * t));
    const phase = TAU * f * t;
    const body = wave(type, phase) + .22 * wave("sine", phase * 2.01) + .08 * wave("sine", phase * 3.01);
    out[from + i] += amplitude * body * env(t, length, .015, Math.min(.5, length * .32));
  }
}
function addDrone(out, start, length, frequency, amplitude) {
  const from = Math.floor(start * rate), count = Math.floor(length * rate);
  for (let i = 0; i < count && from + i < out.length; i++) {
    const t = i / rate;
    const wobble = 1 + .004 * Math.sin(TAU * .35 * t);
    out[from + i] += amplitude * (Math.sin(TAU * frequency * wobble * t) + .28 * Math.sin(TAU * frequency * 2 * t)) * env(t, length, .4, .8);
  }
}
function addDrum(out, start, amplitude = .5, tone = 72) {
  const from = Math.floor(start * rate), length = .62, count = Math.floor(length * rate);
  for (let i = 0; i < count && from + i < out.length; i++) {
    const t = i / rate;
    const hit = Math.sin(TAU * (tone - 28 * Math.min(1, t / .22)) * t) * Math.exp(-7.2 * t);
    const skin = pseudoNoise(from + i) * Math.exp(-18 * t);
    out[from + i] += amplitude * (.9 * hit + .16 * skin);
  }
}
function addGong(out, start, amplitude = .18) {
  const from = Math.floor(start * rate), length = 2.1, count = Math.floor(length * rate);
  const partials = [[196, 1], [293.66, .45], [392, .25], [523.25, .12]];
  for (let i = 0; i < count && from + i < out.length; i++) {
    const t = i / rate;
    let v = 0; for (const [f, a] of partials) v += a * Math.sin(TAU * f * t);
    out[from + i] += amplitude * v * Math.exp(-1.65 * t);
  }
}
function normalize(out) {
  let peak = 0; for (const v of out) peak = Math.max(peak, Math.abs(v));
  const gain = peak > .92 ? .92 / peak : 1; for (let i = 0; i < out.length; i++) out[i] *= gain;
  return out;
}
function wavBuffer(samples) {
  const dataSize = samples.length * 2, b = Buffer.alloc(44 + dataSize);
  b.write("RIFF", 0); b.writeUInt32LE(36 + dataSize, 4); b.write("WAVE", 8);
  b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write("data", 36); b.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(samples[i] * 32767))), 44 + i * 2);
  return b;
}
function lobbyTheme() {
  const seconds = 16, out = buffer(seconds), beat = .72;
  addDrone(out, 0, seconds, 146.83, .16); addDrone(out, 0, seconds, 220, .08);
  [0, 4.8, 9.6, 14.4].forEach(t => addGong(out, t, .12));
  const melody = [0, 2, 3, 4, 3, 2, 0, 4, 5, 4, 3, 2, 0, 2, 3, 4, 6, 5, 4, 3, 2, 0];
  melody.forEach((n, i) => addTone(out, i * beat, beat * .86, pentatonic[n], .12, "triangle", .012, .03));
  for (let b = 0; b < seconds / beat; b += 2) addDrum(out, b * beat, .16, 68);
  return normalize(out);
}
function gameplayTheme() {
  const seconds = 16, out = buffer(seconds), beat = 60 / 132;
  addDrone(out, 0, seconds, 146.83, .13); addDrone(out, 0, seconds, 220, .06);
  const melody = [0, 2, 3, 4, 3, 2, 0, 3, 4, 5, 4, 3, 6, 5, 4, 3, 2, 0, 2, 3, 4, 5, 4, 3];
  melody.forEach((n, i) => addTone(out, i * beat * .66, beat * .52, pentatonic[n], .13, "triangle", .018, .06));
  for (let b = 0; b < seconds / beat; b++) { addDrum(out, b * beat, b % 4 === 0 ? .42 : .22, b % 4 === 0 ? 62 : 92); if (b % 8 === 0) addGong(out, b * beat, .1); }
  return normalize(out);
}
function drumHit() { const out = buffer(1.2); addDrum(out, 0, .8, 82); addDrum(out, .28, .36, 134); return normalize(out); }

await fs.mkdir(path.join(root, "BGM"), { recursive: true });
await fs.mkdir(path.join(root, "SFX"), { recursive: true });
await fs.writeFile(path.join(root, "BGM", "lobby_theme_prototype.wav"), wavBuffer(lobbyTheme()));
await fs.writeFile(path.join(root, "BGM", "gameplay_theme_prototype.wav"), wavBuffer(gameplayTheme()));
await fs.writeFile(path.join(root, "SFX", "vietnamese_drum_prototype.wav"), wavBuffer(drumHit()));
console.log("Generated original Vietnamese-inspired pentatonic BGM and drum prototypes.");
