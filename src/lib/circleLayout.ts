import * as d3 from 'd3';

/**
 * Calculates the angle for each degree on a circle, based on a set of semitone offsets.
 * The first degree is placed at 12 o'clock.
 *
 * @param semitoneOffsets - An array of semitone offsets from the root (e.g., major scale: [0, 2, 4, 5, 7, 9, 11]).
 * @param totalSemitones - The total number of semitones in an octave (usually 12).
 * @returns An array of angles in radians for each degree.
 */
export interface Vector {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Calculates the coordinates for voice-leading vectors between two sets of degrees.
 *
 * @param fromDegrees - The starting degrees.
 * @param toDegrees - The ending degrees.
 * @param degreeAngles - An array of angles in radians for each possible degree.
 * @param radius - The radius of the circle.
 * @param nodeRadius - The radius of the nodes on the circle.
 * @returns An array of Vector objects with {x1, y1, x2, y2} coordinates.
 */
export const calculateVoiceLeadingVectors = (
  fromDegrees: number[],
  toDegrees: number[],
  degreeAngles: number[],
  radius: number,
  nodeRadius: number
): Vector[] => {
  const vectors: Vector[] = [];
  const lines = d3.zip(fromDegrees, toDegrees);

  lines.forEach(([from, to]) => {
    if (from === undefined || to === undefined) return;

    const fromAngle = degreeAngles[from - 1];
    const toAngle = degreeAngles[to - 1];

    const x1_center = radius * Math.cos(fromAngle);
    const y1_center = radius * Math.sin(fromAngle);
    const x2_center = radius * Math.cos(toAngle);
    const y2_center = radius * Math.sin(toAngle);

    const dx = x2_center - x1_center;
    const dy = y2_center - y1_center;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let x1 = x1_center;
    let y1 = y1_center;
    let x2 = x2_center;
    let y2 = y2_center;

    if (distance > 0) {
      const startOffset = nodeRadius / distance;
      x1 = x1_center + dx * startOffset;
      y1 = y1_center + dy * startOffset;

      const endOffset = (distance - nodeRadius - 5) / distance;
      x2 = x1_center + dx * endOffset;
      y2 = y1_center + dy * endOffset;
    }

    vectors.push({ x1, y1, x2, y2 });
  });

  return vectors;
};

export const calculateDegreeAngles = (
  semitoneOffsets: number[],
  totalSemitones: number = 12
): number[] => {
  const semitoneAngle = (2 * Math.PI) / totalSemitones;
  return semitoneOffsets.map(offset => offset * semitoneAngle - Math.PI / 2);
};
