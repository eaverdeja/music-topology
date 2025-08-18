import { describe, it, expect } from 'vitest';
import { calculateDegreeAngles, calculateVoiceLeadingVectors } from './circleLayout';

describe('calculateDegreeAngles', () => {
  it('should calculate angles for a major scale correctly', () => {
    const majorScaleOffsets = [0, 2, 4, 5, 7, 9, 11];
    const angles = calculateDegreeAngles(majorScaleOffsets);

    // Test against pre-calculated, known-good values
    const expectedAngles = [
      -1.5708, // I
      -0.5236, // II
      0.5236,  // III
      1.0472,  // IV
      2.0944,  // V
      3.1416,  // VI
      4.1888   // VII
    ];

    expect(angles.length).toBe(7);
    angles.forEach((angle, i) => {
      expect(angle).toBeCloseTo(expectedAngles[i], 4);
    });
  });

  it('should handle an empty array of offsets', () => {
    const angles = calculateDegreeAngles([]);
    expect(angles).toEqual([]);
  });

  it('should handle a different number of total semitones', () => {
    const offsets = [0, 3, 6, 9]; // A diminished scale
    const angles = calculateDegreeAngles(offsets, 12);
    const semitoneAngle = (2 * Math.PI) / 12;
    const expectedAngles = offsets.map(offset => offset * semitoneAngle - Math.PI / 2);
    
    angles.forEach((angle, i) => {
      expect(angle).toBeCloseTo(expectedAngles[i]);
    });
  });
});

describe('calculateVoiceLeadingVectors', () => {
  const majorScaleOffsets = [0, 2, 4, 5, 7, 9, 11];
  const degreeAngles = calculateDegreeAngles(majorScaleOffsets);
  const radius = 210;
  const nodeRadius = 18;

  it('should calculate a single voice-leading vector', () => {
    const fromDegrees = [1]; // I
    const toDegrees = [5];   // V
    const vectors = calculateVoiceLeadingVectors(fromDegrees, toDegrees, degreeAngles, radius, nodeRadius);

    expect(vectors.length).toBe(1);

    // Test against pre-calculated, known-good values
    const vector = vectors[0];
    expect(vector.x1).toBeCloseTo(-4.658, 2);
    expect(vector.y1).toBeCloseTo(-192.61, 2);
    expect(vector.x2).toBeCloseTo(-99.05, 2);
    expect(vector.y2).toBeCloseTo(159.65, 2);
  });

  it('should handle multiple voice-leading vectors', () => {
    const fromDegrees = [1, 3, 5]; // I Major
    const toDegrees = [5, 7, 2];   // V7
    const vectors = calculateVoiceLeadingVectors(fromDegrees, toDegrees, degreeAngles, radius, nodeRadius);
    expect(vectors.length).toBe(3);
  });

  it('should return an empty array when degree arrays are empty', () => {
    const vectors = calculateVoiceLeadingVectors([], [], degreeAngles, radius, nodeRadius);
    expect(vectors).toEqual([]);
  });
});

