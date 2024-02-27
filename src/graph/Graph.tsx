import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";

import * as Types from "../types/types";
import { clamp } from "../utils/helpers";

export default function Graph({ graph }: { graph: Types.GraphData }) {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (!width || !height) return;

    const svg = d3.select(svgRef.current);

    const nodes = graph.nodes.map((node) => node);
    const links = graph.links.map((link) => link);

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-3000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance((d) => clamp(d.distance, 0, 500)),
      )
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force(
        "radial",
        d3.forceRadial(Math.min(width, height) - 500, width / 2, height / 2),
      )
      .on("tick", () => {
        svg
          .selectAll(".link")
          .data(links)
          .join("line")
          .attr("class", "link")
          .attr("stroke", (link) => link.type.color)
          .attr("stroke-width", "3")
          .attr("fill", "none")
          .attr("x1", (link) => link.source.x)
          .attr("y1", (link) => link.source.y)
          .attr("x2", (link) => link.target.x)
          .attr("y2", (link) => link.target.y);

        svg
          .selectAll(".node")
          .data(nodes)
          .join("circle")
          .attr("class", "node pointer-events-auto")
          .attr("r", 8)
          .attr("cx", (node) => node.x)
          .attr("cy", (node) => node.y)
          .call(
            d3
              .drag() // Attach drag behavior
              .on("start", (event: unknown, d: Types.GraphNode) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
              })
              .on("drag", (event: unknown, d: Types.GraphNode) => {
                d.fx = event.x;
                d.fy = event.y;
              })
              .on("end", (event: unknown, d: Types.GraphNode) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
              }),
            undefined,
          );

        svg
          .selectAll(".label")
          .data(nodes)
          .join("text")
          .attr("class", "label pointer-events-none")
          .attr("text-anchor", "middle")
          .attr("font-size", 20)
          .text((node) => node.name)
          .attr("x", (node) => node.x)
          .attr("y", (node) => node.y)
          .attr("dx", 21)
          .attr("dy", -10);
      });
  }, [graph]);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none inset-0 h-screen w-screen bg-white"
    >
      <svg ref={svgRef} className="h-full w-full"></svg>
    </div>
  );
}
