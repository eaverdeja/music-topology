# Music Topology Visualization Plan

## Notes

- Goal: build a web application that visualises the topological structure of chord progressions, their voice-leading, and their rotations.
- Topology is defined over scale-degree space rather than semitone space, allowing rotations that preserve relative voice movements.
- Chords are initially limited to shell voicings (root, 3rd, 7th) but model should remain extensible.
- Visual metaphors needed: chromatic/diatonic circle, directed graphs for voice movements, clustering/crossing indicators.
- Tech stack:
  - TypeScript + React for UI and algorithm layer (pure client-side)
  - Music21j for music-theory data structures & utilities
  - D3.js (or react-flow / visx) for interactive SVG visualisation (learning resources needed; user new to D3)
  - (Backend optional in later phases)
- Core algorithms: mapping chord → ordered tuple of scale degrees; computing voice-leading vectors; detecting clusters & crossings; rotation (cyclic permutation of degrees).
- Long-term: rating function for "interesting" progressions based on movement patterns.

## Task List (updated 2025-08-17)

### Completed

- [x] Formalise data model for chords, scales, progressions
- [x] Specify mathematical representation of voice-leading vectors & topology
- [x] Set up Vite + React repo scaffold
- [x] Implement core algorithm module in TypeScript + Music21j (makeChord/makeShell, degrees, VL, rotation)
- [x] Basic smoke tests in place (algorithms compile & run)

### In progress / Next up

- [ ] Learn basic D3 patterns (circle layout, arrows)
- [ ] Build front-end component rendering hard-coded demo progression on diatonic circle
- [ ] Add rotation slider & inversion explorer interactions
- [ ] Expand unit-test suite for edge cases, error handling, rotation, metrics
- [ ] Rotation-equivalence detection helper
- [ ] Prototype CLI / example script (iii-vi-ii → IV-vii-iii)
- [ ] Choose visual stack & draft SVG/D3 wireframes

### Stretch / Advanced

- [ ] Tymoczko taxicab toggle & orbifold view

### Deployment & polish

- [ ] Deploy MVP (Vercel/Netlify)
- [ ] User testing & polish
- [ ] Write full visualisation spec / documentation

- [ ] Choose visual stack & draft SVG/D3 wireframes
- [ ] Learn basic D3 patterns (circle layout, arrows)
- [ ] Build front-end component rendering hard-coded demo progression on diatonic circle
- [ ] Add rotation slider & inversion explorer interactions
- [ ] Metrics panel (motion sum, contrary %, clusters, crossings)
- [ ] Optional advanced: Tymoczko taxicab toggle & orbifold view
- [ ] Deploy MVP (Vercel/Netlify)
- [ ] User testing & polish
- [ ] Write full visualisation spec / documentation

## Current Focus

Implement D3 SVG circle rendering of shell chords & voice-leading vectors

Once that is solid we’ll revisit rotation helper and broader test coverage.
