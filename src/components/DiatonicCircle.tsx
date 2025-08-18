import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import type { Degree } from "../lib/musicVoicing";
import {
  calculateDegreeAngles,
  calculateVoiceLeadingVectors,
} from "../lib/circleLayout";

interface DiatonicCircleProps {
  fromDegrees: Degree[];
  toDegrees: Degree[];
}

const DiatonicCircle: React.FC<DiatonicCircleProps> = ({
  fromDegrees,
  toDegrees,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2 - 40;

    svg.attr("width", width).attr("height", height);

    // Clear previous render
    svg.selectAll("*").remove();

    const graph = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Draw the circle
    graph
      .append("circle")
      .attr("r", radius)
      .style("fill", "none")
      .style("stroke", "#ccc");

    // --- Draw Nodes and Labels ---
    const nodeRadius = 18;
    const fromColor = "#4dabf7"; // A nice blue
    const toColor = "#ff6b6b"; // A reddish-pink

    const degrees = ["I", "II", "III", "IV", "V", "VI", "VII"];
    const semitoneOffsets = [0, 2, 4, 5, 7, 9, 11]; // Major scale steps (W-W-H-W-W-W-H)
    const degreeAngles = calculateDegreeAngles(semitoneOffsets);

    degrees.forEach((degreeStr, i) => {
      const currentDegree = (i + 1) as Degree;
      const angle = degreeAngles[i];
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const isFromNode = fromDegrees.includes(currentDegree);
      const isToNode = toDegrees.includes(currentDegree);

      // Draw node circles
      if (isFromNode && isToNode) {
        // Split circle for common tones
        const arcGenerator = d3.arc().innerRadius(0).outerRadius(nodeRadius);
        graph
          .append("path")
          .attr(
            "d",
            arcGenerator({
              startAngle: -Math.PI / 2,
              endAngle: Math.PI / 2,
              innerRadius: 0,
              outerRadius: nodeRadius,
            })!
          )
          .attr("transform", `translate(${x},${y})`)
          .style("fill", fromColor);
        graph
          .append("path")
          .attr(
            "d",
            arcGenerator({
              startAngle: Math.PI / 2,
              endAngle: (3 * Math.PI) / 2,
              innerRadius: 0,
              outerRadius: nodeRadius,
            })!
          )
          .attr("transform", `translate(${x},${y})`)
          .style("fill", toColor);
      } else if (isFromNode) {
        graph
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", nodeRadius)
          .style("fill", fromColor);
      } else if (isToNode) {
        graph
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", nodeRadius)
          .style("fill", toColor);
      } else {
        graph
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", nodeRadius)
          .style("fill", "white")
          .style("stroke", "#e0e0e0")
          .style("stroke-width", 1.5);
        graph
          .append("text")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .style("fill", "#333")
          .style("font-size", "14px")
          .text(degreeStr);
      }

      // Draw degree labels for active nodes
      if (isFromNode || isToNode) {
        graph
          .append("text")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .style("fill", "white")
          .style("font-size", "14px")
          .text(degreeStr);
      }
    });

    // Draw voice-leading vectors
    const vectors = calculateVoiceLeadingVectors(
      fromDegrees,
      toDegrees,
      degreeAngles,
      radius,
      nodeRadius
    );
    vectors.forEach((vector) => {
      graph
        .append("line")
        .attr("x1", vector.x1)
        .attr("y1", vector.y1)
        .attr("x2", vector.x2)
        .attr("y2", vector.y2)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");
    });

    // Define arrow marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("class", "arrow-head");
  }, [fromDegrees, toDegrees]);

  return <svg ref={svgRef}></svg>;
};

export default DiatonicCircle;
