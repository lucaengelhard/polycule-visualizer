import { useContext, useEffect, useRef, useState } from "react";
import { DBContext, EditContext } from "../../App";
import * as Types from "../../types";
import { distanceScale } from "../../utils/helpers";
import Link from "../../classes/link";
import * as d3 from "d3";

export default function Graph() {
  const { DBState } = useContext(DBContext);
  const [graph, setGraph] = useState(DBState);

  const { setEditState } = useContext(EditContext);

  const canvasRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setGraph(DBState);
  }, [setGraph, DBState]);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (!width || !height) return;

    const canvas = d3.select(canvasRef.current);

    if (canvas === null || canvas === undefined) return;

    const nodes = Object.values(graph.nodes).map((node) => node);
    const links = Object.values(graph.links).map((link) => link);
    //TODO: const noLinkLinks -> for linkforce of nodes that don't have link
    const simulation = createSimulation(nodes, width, height, links);

    function createSimulation(
      nodes: Types.Node[],
      width: number,
      height: number,
      links: Link[],
    ) {
      return d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-3000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force(
          "link",
          d3
            .forceLink(links)
            .id((node: unknown) => (node as Types.Node).id)
            .distance((link) => distanceScale(link.distance)),
        )
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force(
          "radial",
          d3.forceRadial(Math.min(width, height) - 500, width / 2, height / 2),
        )
        .on("tick", onSimulationTick);
    }

    function onSimulationTick() {
      canvas
        .selectAll(".link")
        .data(links)
        .join("line")
        .attr("class", "link")
        .attr("stroke", (link) => link.type.color)
        .attr("stroke-width", "3")
        .attr("fill", "none")
        .attr("x1", (link) => (link.source.x ? link.source.x : 0))
        .attr("y1", (link) => (link.source.y ? link.source.y : 0))
        .attr("x2", (link) => (link.target.x ? link.target.x : 0))
        .attr("y2", (link) => (link.target.y ? link.target.y : 0));

      canvas
        .selectAll(".node")
        .data(nodes)
        .join("circle")
        .attr("class", "node pointer-events-auto cursor-pointer")
        .attr("r", 8)
        .attr("cx", (node) => (node.x ? node.x : 0))
        .attr("cy", (node) => (node.y ? node.y : 0))
        .on("click", (_e, d) => {
          setEditState({ link: undefined, node: d.id });
        })
        .call(
          d3
            .drag()
            .on("start", (event: any, d: Types.Node) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on("drag", (event: any, d: Types.Node) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on("end", (event: any, d: Types.Node) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any,
          undefined,
        );

      canvas
        .selectAll(".label")
        .data(nodes)
        .join("text")
        .attr("class", "label pointer-events-none")
        .attr("text-anchor", "middle")
        .attr("font-size", 20)
        .text((node) => node.name)
        .attr("x", (node) => (node.x ? node.x : 0))
        .attr("y", (node) => (node.y ? node.y : 0))
        .attr("dx", 21)
        .attr("dy", -12);
    }
  }, [graph, setEditState]);
  return (
    <svg
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    ></svg>
  );
}
