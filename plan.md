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

## Task List
- [ ] Gather and document precise functional requirements with user (features, UX, tech preferences)
- [x] Formalise data model for chords, scales, and progressions in scale-degree space
- [x] Specify mathematical representation of voice-leading vectors and topological graph
- [ ] Design algorithm for rotation of progressions and detection of equivalent structures
- [ ] Prototype core algorithms in TypeScript (Music21j) with example (iii-vi-ii → IV-vii-iii)
- [ ] Choose visual components and draft wireframes of UI (circle, arrows, transformations)
- [ ] Set up project repo with chosen tech stack (monorepo or split)
- [ ] Implement client-side algorithm module (TS + Music21j) to compute topology data from chord list
- [ ] Learn basic D3 patterns (circle layout, arrows) to enable visualisation
- [ ] Develop front-end React component rendering circle and voice-leading arrows from API data
- [ ] Add interaction: user inputs chords, highlight rotations, step through voice-leading
- [ ] Implement metrics engine to evaluate "interestingness" (clusters, crossings, pattern variety)
- [ ] Testing: unit tests for algorithms, usability tests for UI
- [ ] Deploy MVP to web (e.g., Vercel / Netlify)
- [ ] Write detailed specification for visualisation components and interactions

## Current Goal
Write detailed specification for visualisation components and interactions
