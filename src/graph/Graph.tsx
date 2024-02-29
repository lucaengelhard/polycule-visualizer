import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import * as Types from "../types/types-old";
import { clamp, distanceScale, findFullSourceTarget } from "../utils/helpers";
import { Pencil } from "lucide-react";
import { change } from "../db";
import { geoCode } from "../utils/geocode";

export default function Graph({ graph }: { graph: Types.GraphData }) {
  const svgRef = useRef(null);
  const layer2ref = useRef(null);
  const wrapperRef = useRef(null);
  const [personInfo, setPersonInfo] = useState<Types.GraphNode | undefined>(
    undefined,
  );

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (!width || !height) return;

    const svg = d3.select(svgRef.current);
    const layer2 = d3.select(layer2ref.current);

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
          .distance((d) => {
            console.log(distanceScale(d.distance));

            return clamp(d.distance, 0, 800);
          }),
      )
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force(
        "radial",
        d3.forceRadial(Math.min(width, height) - 500, width / 2, height / 2),
      )
      .on("tick", () => {
        layer2
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
          )
          .on("click", (e, d) => {
            setPersonInfo(d);
          });

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
          .attr("dy", -12);
      });
  }, [graph]);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none relative inset-0 h-screen w-screen bg-white"
    >
      <svg ref={layer2ref} className="absolute inset-0 h-full w-full"></svg>
      <svg ref={svgRef} className="absolute inset-0  h-full w-full"></svg>

      {personInfo && <PersonInfo person={personInfo} />}
    </div>
  );
}

function PersonInfo({ person }: { person: Types.GraphNode }) {
  function changeName(event: React.ChangeEvent<HTMLInputElement>) {
    person.name = event.target.value;

    console.log(change("node", person));
  }
  async function changeLocation(event: React.ChangeEvent<HTMLInputElement>) {
    person.location = await geoCode(event.target.value);

    console.log(change("node", person));
  }
  return (
    <div className="pointer-events-auto fixed bottom-3 left-3 w-56 rounded-lg bg-white p-3 shadow-xl">
      <input
        type="text"
        className="font-bold"
        defaultValue={person.name}
        onBlur={changeName}
      />
      <input
        type="text"
        className=""
        defaultValue={person.location.name}
        onBlur={changeLocation}
      />
      {person.relationships.length > 0 && (
        <ul className="mt-3">
          Relationships:
          {person.relationships.map((rel, index) => {
            return <PersonRelListItem key={index} person={person} rel={rel} />;
          })}
        </ul>
      )}
    </div>
  );
}

function PersonRelListItem({
  person,
  rel,
}: {
  key: number;
  person: Types.GraphNode;
  rel: Types.GraphLink;
}) {
  const cleanRel = findFullSourceTarget(rel);
  rel.source = cleanRel.source as Types.GraphNode;
  rel.target = cleanRel.target as Types.GraphNode;
  return (
    <li className="group mt-1 flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-white pr-3 transition-transform hover:translate-x-2">
      <div>
        <div className="font-bold text-blue-500">
          {rel.source.name === person.name ? rel.target.name : rel.source.name}
        </div>
        <div className="text-blue-500/50">
          {rel.source.name === person.name
            ? rel.target.location.name
            : rel.source.location.name}
        </div>
      </div>
      <Pencil
        className="opacity-0 transition-opacity group-hover:opacity-100"
        color="rgb(59 130 246)"
        size={22}
      />
    </li>
  );
}
