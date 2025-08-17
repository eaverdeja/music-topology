import * as m21 from "music21j";
export type Kind = keyof typeof m21.chord.chordDefinitions;

export class ChordSymbol {
  readonly chord: m21.chord.Chord;
  readonly kind: Kind;
  readonly rootName: string;

  constructor(symbol: string) {
    // root (with optional accidental) + the rest
    const [, root, rest] = symbol.match(/^([A-Ga-g][#b]?)(.*)$/)!;
    this.rootName = root.toUpperCase();
    // crude kind detection
    const guess = (Object.keys(m21.chord.chordDefinitions) as Kind[]).find(
      (k) => rest.toLowerCase().includes(k.slice(0, 3))
    );
    this.kind = guess ?? "major";

    // derive 3rd & 7th letter names
    const rootPitch = new m21.pitch.Pitch(`${this.rootName}4`);
    const intThird = this.kind.includes("minor")
      ? new m21.interval.Interval("m3")
      : new m21.interval.Interval("M3");
    const intSeventh =
      this.kind.includes("major") && !this.kind.includes("dominant")
        ? new m21.interval.Interval("M7")
        : new m21.interval.Interval("m7");
    const thirdPitch = intThird.transposePitch(rootPitch);
    const seventhPitch = intSeventh.transposePitch(rootPitch);
    this.chord = new m21.chord.Chord([rootPitch, thirdPitch, seventhPitch]);
  }

  root() {
    return this.rootName;
  }

  shellPitches(): [string, string, string] {
    return [
      this.rootName,
      this.chord.pitches[1].name,
      this.chord.pitches[2].name,
    ];
  }
}
