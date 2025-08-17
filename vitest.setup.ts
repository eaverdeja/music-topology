// Polyfill for music21j UMD bundle under Node
if (typeof globalThis.self === "undefined") {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.self = globalThis;
}
