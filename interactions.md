# Retrospective: LLM-Assisted Development (Music Topology Project)

This document reflects on the initial development phase of the Music Topology project, focusing on the strengths and weaknesses of using an LLM assistant. The goal is to identify effective patterns and highlight common failure modes for future reference.

## The Good: LLM as an Accelerator

The LLM proved most effective at tasks that were procedural or could be guided by high-level intent, significantly speeding up the development loop.

- **Generating Code & Concepts from Intent:** The LLM successfully translated abstract requirements into concrete code and formalisms. For example, it generated the correct mathematical definitions for voice-leading vectors and pitch-space transformations directly into the `spec.md` file given a wireframe and 4 paragraph description. Similarly, the request to "raise an error indicating the chord cannot be voiced as a shell" was correctly implemented with a `throw new Error(...)` statement.

- **Rapid Scaffolding & Boilerplate:** The initial project setup, including the Vite+React configuration, TypeScript settings, and Vitest test framework, was accomplished almost instantly. The creation of the initial `ChordSymbol.ts` and `musicVoicing.ts` files from the spec was also a significant time-saver.

- **High-Level, Multi-File Refactoring:** The LLM excelled at applying structural changes across the codebase from a single command. For instance, when we decided to change the `music21j` import style from a global-hack to a direct `import * as m21`, the change was applied to both `ChordSymbol.ts` and `musicVoicing.ts` simultaneously. This pattern is much faster than a developer performing a manual search-and-replace.

- **Task & Goal Management:** Using `plan.md` as a shared "source of truth" for the project's direction was highly effective. The LLM was able to parse the user's intent to re-prioritize tasks (e.g., deferring test expansion to focus on D3 rendering) and update the plan accordingly. This provided a valuable, persistent anchor for the collaboration.

## The Bad: LLM Hallucinations & Brittle Logic

The primary friction points arose from the LLM's tendency to invent nonexistent APIs and write fragile, assumption-based code that failed on edge cases.

- **API Hallucination:** This was the most significant and recurring issue.

  - The LLM initially tried to use a `m21.harmony.ChordSymbol` class, which does not exist in the library.
  - It then incorrectly assumed the `m21.chord.Chord` constructor could accept a raw string like `"Cm7"`, leading to runtime errors. The constructor actually requires an array of pitch objects.
  - It also hallucinated a `.figure` property on the `Chord` object when trying to generate a descriptive error message.

- **Incorrect Exemplification:** The LLM sometimes produced incorrect examples within a body of otherwise correct text, making the error difficult to spot. For instance, it generated a faulty illustration of a "mixed-tight movement" voice-leading vector due to bad arithmetic. Because the surrounding explanation of the concept was accurate, identifying the incorrect example felt like searching for a needle in a haystack.

- **Fragile, Incorrect Logic:** The first implementation of `third()` and `seventh()` relied on naive string manipulation and array arithmetic. This code was brittle and failed with an obscure "U is not a valid step name" error, which was difficult to debug. The correct, robust solution was to use `music21j`'s built-in interval transposition, which the LLM eventually arrived at after several failed attempts.

- **Incorrect Tool Usage & State Drift:** The LLM frequently failed to use the `replace_file_content` tool correctly, providing a `TargetContent` that did not exactly match the text in the file. This indicates a drift between the LLM's internal model of the code and the actual state of the file, often after a previous, partially successful edit. This forced the user to intervene or the LLM to make multiple attempts.

- **Overly Confident Tone:** The LLM often made definitive statements like "This will fix the issue and all tests will now pass," only for a new error to surface. A more cautious, iterative approach ("This should address the `TypeError`; let's re-run the tests to see what's next") would set more realistic expectations and better reflect the nature of debugging.
