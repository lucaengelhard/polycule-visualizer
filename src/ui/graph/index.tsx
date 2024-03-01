import { useContext, useEffect, useRef, useState } from "react";
import { DBContext, EditContext } from "../../App";
import * as Types from "../../types";
import { convertObjectToNumberArray, distanceScale } from "../../utils/helpers";
import Link from "../../classes/link";
import * as d3 from "d3";

export default function Graph() {
  const { DBState } = useContext(DBContext);
  const { setEditState } = useContext(EditContext);
  const [graph, setGraph] = useState<Types.GraphData | undefined>(undefined);

  const canvasRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    reloadGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setGraph, DBState]);

  useEffect(() => {
    if (graph === undefined) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(canvasRef.current);

    svg.selectAll("g").remove();

    const simulation = d3
      .forceSimulation(graph.nodes)
      .alphaDecay(0.2)
      .force(
        "charge",
        d3.forceManyBody().strength((node) => (node.id !== -1 ? -300 : 0)),
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "link",
        d3
          .forceLink(graph.links)
          .id((node: unknown) => (node as Types.Node).id)
          .distance((link) => distanceScale(link.distance)),
      )
      .force(
        "radial",
        d3
          .forceRadial(Math.min(width, height) - 600, width / 2, height / 2)
          .strength(1.5),
      );

    const link = svg
      .append("g")
      .selectAll("line")
      .data(graph.links)

      .enter()
      .append("line")
      .attr("stroke", (link) => link.type.color)
      .attr("stroke-width", "3")
      .attr("fill", "none");

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("class", "node pointer-events-auto cursor-pointer")
      .attr("r", (d) => (d.id !== -1 ? 8 : 0))
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .on("end", dragended) as any,
        undefined,
      )
      .on("click", (_e, node) => {
        setEditState({ node: node.id, link: undefined });
      });

    const label = svg
      .append("g")
      .selectAll("text")
      .data(graph.nodes)
      .enter()
      .append("text")
      .attr("class", "pointer-events-none")
      .attr("text-anchor", "middle")
      .attr("font-size", 20)
      .text((node) => (node.id !== -1 ? node.name : ""))
      .attr("dx", 21)
      .attr("dy", -12);

    simulation.on("tick", ticked);

    function ticked() {
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      label.attr("x", (d) => d.x).attr("y", (d) => d.y);

      if (graph === undefined) return;
      link
        .attr("x1", (d) => graph.nodes[d.source.id].x ?? 0)
        .attr("y1", (d) => graph.nodes[d.source.id].y ?? 0)
        .attr("x2", (d) => graph.nodes[d.target.id].x ?? 0)
        .attr("y2", (d) => graph.nodes[d.target.id].y ?? 0);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup function
    return () => {
      simulation.on("tick", null); // remove tick event listener
    };
  }, [graph, setEditState]);

  function reloadGraph() {
    const placeHolderNode: Types.Node = {
      name: "Node",
      id: -1,
      location: { name: "Cala Santany", lat: 39.330987, lon: 3.145875 },
      links: new Set(),
    };

    const placeHolderLink: Link = {
      id: -1,
      source: placeHolderNode,
      target: placeHolderNode,
      type: { name: "placeholder", id: -1, color: "#ffffff" },
      distance: 0,
    };

    const nodes = convertObjectToNumberArray(DBState.nodes, placeHolderNode);
    const links = convertObjectToNumberArray(DBState.links, placeHolderLink);

    setGraph({ nodes: nodes, links: links });
  }

  return (
    <svg
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    ></svg>
  );
}
