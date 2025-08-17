import { describe, it, expect } from "vitest";
import {
  makeShell,
  chordToDegrees,
  voiceLeading,
  allInversionPairs,
} from "./musicVoicing";

// basic smoke tests – use key C major

describe("musicVoicing helpers", () => {
  it("creates shell chord with correct note count", () => {
    const sh = makeShell("Em7", 1);
    expect(sh.notes.length).toBe(3);
  });

  it("maps notes to degrees in key", () => {
    const sh = makeShell("Dm7", 0);
    const degs = chordToDegrees(sh, "C");
    expect(degs).toEqual([2, 4, 1]); // D F C
  });

  it("computes diatonic voice-leading vector", () => {
    const from = makeShell("Em7", 1); // G-D-E
    const to = makeShell("Am7", 0); // A-C-G
    const vl = voiceLeading(from, to, "C");
    expect(vl).toEqual([1, -1, 2]);
  });

  it("enumerates 9 inversion pairs", () => {
    const pairs = allInversionPairs("Em7", "Am7", "C");
    expect(pairs.length).toBe(9);
  });
});
