/*
  musicVoicing.ts
  Core music–theory helpers used throughout the Music-Topology project.

  Implementation follows `spec.md` (Data Structures & Public API section).
*/

import * as m21 from "music21j";
import { ChordSymbol } from "./ChordSymbol";

export type Degree = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Chord {
  symbol: string;
  inversion?: number; // 0 = root, 1 = first inversion, …
  notes: string[]; // ordered bass→top, length ≥ 3, pitch names (e.g. 'C4')
}

export interface ShellChord extends Chord {
  inversion: 0 | 1 | 2;
  notes: [string, string, string];
}

/** Create a generic chord from a symbol, letting music21j spell pitches.
 *  `inversion` rotates chord tones so desired member is in the bass.
 */
export function makeChord(symbol: string, inversion = 0): Chord {
  const cs = new ChordSymbol(symbol);
  const pitches = cs.chord.pitches;
  // Bring to desired inversion by rotating array
  const rotated = [...pitches.slice(inversion), ...pitches.slice(0, inversion)];
  const noteNames: string[] = rotated.map((p: any) => p.nameWithOctave);
  return {
    symbol,
    inversion,
    notes: noteNames,
  };
}

/** Create a ShellChord (root, 3rd, 7th) in given inversion */
export function makeShell(
  symbol: string,
  inversion: 0 | 1 | 2 = 0
): ShellChord {
  const cs = new ChordSymbol(symbol);
  const [root, third, seventh] = cs.shellPitches();
  const tones = [root, third, seventh];
  const rotated = [...tones.slice(inversion), ...tones.slice(0, inversion)] as [
    string,
    string,
    string
  ];
  return { symbol, inversion, notes: rotated };
}

/** Convert chord to diatonic scale-degree numbers (1-7) in given key */
export function chordToDegrees(chord: Chord, key: string): Degree[] {
  const k = new m21.key.Key(key);
  return chord.notes.map((note) => {
    const withOct = /\d/.test(note) ? note : `${note}4`;
    const p = new m21.pitch.Pitch(withOct);
    const deg = k.getScaleDegreeFromPitch(p);
    if (deg !== undefined) return deg as Degree;
    const letter = p.step; // 'C'..'B'
    const map: Record<string, Degree> = {
      C: 1,
      D: 2,
      E: 3,
      F: 4,
      G: 5,
      A: 6,
      B: 7,
    };
    return map[letter];
  });
}

/** Minimal-distance diatonic voice-leading vector between two chords */
export function voiceLeading(a: Chord, b: Chord, key: string): number[] {
  const da = chordToDegrees(a, key);
  const db = chordToDegrees(b, key);
  const len = Math.min(da.length, db.length);
  const signed: number[] = [];
  for (let i = 0; i < len; i += 1) {
    const raw = (db[i] - da[i] + 7) % 7;
    signed.push(raw <= 3 ? raw : raw - 7);
  }
  return signed;
}

/** Rotate every note of every chord by k degrees (mod 7) */
export function rotateProgression(
  chords: Chord[],
  k: Degree,
  key: string
): Chord[] {
  const kIdx = Number(k) as number;
  const relScale = new m21.scale.MajorScale(key);
  return chords.map((ch) => {
    const degs = chordToDegrees(ch, key);
    const newNotes = degs.map((d) => {
      const newDeg = ((d + kIdx - 1) % 7) + 1;
      const pc = relScale.pitchFromDegree(newDeg); // music21.pitch.Pitch
      return pc.name; // drop octave, keep pc name
    });
    return { ...ch, notes: newNotes };
  });
}

/** Enumerate all 3×3 inversion pairs for shell chords and compute VL */
export function allInversionPairs(
  fromSym: string,
  toSym: string,
  key: string
): Array<{ from: Chord; to: Chord; vl: number[] }> {
  const res: Array<{ from: Chord; to: Chord; vl: number[] }> = [];
  ([0, 1, 2] as const).forEach((i) => {
    ([0, 1, 2] as const).forEach((j) => {
      const from = makeShell(fromSym, i);
      const to = makeShell(toSym, j);
      res.push({ from, to, vl: voiceLeading(from, to, key) });
    });
  });
  return res;
}
