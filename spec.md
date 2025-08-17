# Music Topology Visualisation — Specification

## 1. Purpose

Build a browser-based tool that lets musicians enter a diatonic chord progression and immediately see

1. its **topological structure** (movement of each voice on a 7-degree circle),
2. alternative rotations that preserve that structure, and
3. quantitative hints about “interestingness” (tightness, contrary vs parallel motion, clusters, crossings).

MVP audience: harmony students & composers exploring creative voice-leading.

---

## 2. Core Concepts

### 2.1 Scale-Degree Space

Diatonic scale degrees are treated as integers `1-7` wrapped modulo 7. This turns the scale into a circle where clockwise = “up a step”. All movement calculations ignore chromatic semitone size — only degree distance matters.

### 2.2 Chord & ShellChord

*Chord* is the generic concept: an ordered set of pitches derived from a symbol plus an optional inversion number.

A **Chord** is an ordered set of pitches obtained from a symbol plus an optional inversion.

A `ShellChord` is a **specialisation** of `Chord` that keeps only the root, 3rd and 7th and therefore always contains exactly three notes.

`Chord` is generic enough to represent simple triads, seventh-chords, quartal voicings, etc.; all subsequent algorithms accept any `Chord` instance.

Shell voicings depend **only on the chord symbol itself**, not on the surrounding key: e.g. `Em7` → `E–G–D`.

Conversion from absolute notes to diatonic scale-degrees is deferred until a **key context** is supplied for voice-leading calculations.

### 2.3 Voice-Leading Vector (VL)
With a key context we first map every note to its diatonic **degree** (`1-7`).  For two voiced chords *A → B* aligned as `(a₀,a₁,a₂)` → `(b₀,b₁,b₂)`:
1. *Raw clockwise distance*  `rawᵢ = (bᵢ − aᵢ + 7) mod 7` → range 0-6.
2. *Shortest signed step*    `vlᵢ = rawᵢ ≤ 3 ? rawᵢ : rawᵢ − 7` → range -3…+3.
3. Collect the tuple **VL = `[vl₀, vl₁, vl₂]`**.

Properties
* `|vlᵢ| ≤ 3` highlights tight motion.
* Sign patterns show parallel (`+++`), contrary (`+−…`), oblique (`0…`).
* Adding a constant `k` to *all* degrees of *both* chords (a **rotation**) leaves VL unchanged.

**Illustrative examples in C major**
```
// Parallel movement (all voices ↑ 3 degrees)
Em7 root-pos : E-G-D  → degrees [3,5,2]
Am7 root-pos : A-C-G  → degrees [6,1,5]
VL = [+3, +3, +3]

// Mixed tight movement
Em7 1st inversion (3rd-in-bass) : G-D-E → degrees [5,2,3]
Am7 root position               : A-C-G → degrees [6,1,5]
VL = [+1, −1, +2]
```

### 2.4 Rotation

A rotation by `k` (1-6) maps every degree `d` to `(d + k) mod 7`. It produces a new progression with identical VL vectors but different absolute notes (e.g. `iii-vi-ii` → `IV-vii-iii`).

### 2.5 Topological Graph

For an entire progression we chain the VL vectors, drawing each voice around the circle. Edge shapes (straight, circular, angular) and intersections represent clusters & crossings.

---

## 3. Functional Requirements (MVP)

1. **Input**
   - Key signature (major mode for now).
   - Chord symbols list (diatonic, supports `maj7|min7|dom7`).
   - Optional inversion selection for each chord _OR_ "auto explore all".
2. **Algorithmic Engine** (client-side TS + Music21j)
   - Parse symbols → `Chord` / `ShellChord`.
   - Generate voiced chords for requested inversions.
   - Compute VL for each adjacent pair.
   - Offer helpers: `rotateProgression`, `allInversionPairs`, scoring utilities (total motion, parallel %, crossings count).
3. **Visualisation**
   - Diatonic circle (SVG) with degree labels.
   - Arrows for each voice between chords 1→2, 2→3, …
   - Toggle: show single chosen voicing vs best-scored voicing vs enumerate all.
   - Rotation slider (k=0-6) updates display live.
4. **Metrics Panel**
   - Total absolute motion Σ|vl|
   - Number of contrary/parallel/oblique instances.
   - Cluster & crossing flags.
5. **UX**
   - Simple React form on left, visual + metrics on right.
   - D3 transitions when updating voicings or rotation.

---

## 4. Non-Functional / Tech Stack

| Layer         | Choice                                                        |
| ------------- | ------------------------------------------------------------- |
| Language      | TypeScript 5+                                                 |
| Framework     | React 18 + Vite                                               |
| Music theory  | **Music21j**                                                  |
| Visualisation | **D3.js v7** (SVG)                                            |
| State mgmt    | React hooks                                                   |
| Testing       | Vitest + RTL (remember MSW for API mocks once backend exists) |
| Deployment    | Vercel/Netlify static site                                    |

---

## 5. Data Structures & Public API (TS)

```ts
export type Degree = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Chord {
  symbol: string;
  inversion?: number;        // 0 = root, 1 = first inversion, …
  notes: string[];           // ordered bass→top, length ≥ 3
}

export interface ShellChord extends Chord {
  inversion: 0 | 1 | 2;      // root, 3rd, or 7th in bass
  notes: [string, string, string];
}

// Factories
export function makeChord(symbol: string, inversion?: number): Chord;
export function makeShell(symbol: string, inversion?: 0 | 1 | 2): ShellChord;

// Utilities (work with any Chord)
export function chordToDegrees(chord: Chord, key: string): Degree[];
export function voiceLeading(a: Chord, b: Chord, key: string): number[];
export function rotateProgression(chords: Chord[], k: Degree, key: string): Chord[];
export function allInversionPairs(fromSym: string, toSym: string, key: string):
  Array<{ from: Chord; to: Chord; vl: number[] }>;
```

---

## 6. Milestones

1. **Repo scaffold** (Vite + deps) ⟶ commit
2. **Algorithm module** (`musicVoicing.ts`) with exhaustive tests
3. **Hard-coded demo progression** rendered on circle
4. **Interactive rotation slider**
5. **Inversion explorer + metrics panel**
6. **User chord input form**
7. **Polish UI & deploy MVP**

---

## 7. Future Extensions (post-MVP)

- Support chromatic alterations & extended chords (9ths etc.).
- Add playback (tone.js) to hear chosen voicing vs rotation.
- Machine-learned “interestingness” score from voice-leading corpus.
- **Rendering enhancements**
  * Render chord progression on traditional staff notation (SVG).
  * Render on a configurable **stringed-instrument neck**:
    * User sets number of strings and their tunings.
    * Supports guitar, mandolin, cavaquinho, etc.
- **Tymoczko voice-leading space & metrics**
  * Switchable **taxicab norm** (sum of semitone motions) alongside diatonic-step VL.
  * 3-D orbifold visualisation of chord paths (three.js/WebGL).
  * "Nearest-neighbors" panel to suggest small-distance reharmonisations.
  * Geodesic path finder between two chords.
  * Optional educational overlay with hexatonic/region labels based on Tymoczko terminology.
