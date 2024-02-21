import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { graph, Relationship, platonic, romantic } from "../dist/index.mjs";

const canvas = d3.select("#canvas");
const linkGroup = canvas.append("g").attr("class", "links");
const nodeGroup = canvas.append("g").attr("class", "nodes");

canvas.attr("width", window.innerWidth);
canvas.attr("height", window.innerHeight);

const links = linkGroup
  .selectAll("line")
  .data(graph.links)
  .enter()
  .append("line")
  .attr("stroke-width", 3)
  .style("stroke", "orange");

const drag = d3
  .drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended);

const nodeAndText = nodeGroup
  .selectAll("g")
  .data(graph.nodes)
  .enter()
  .append("g")
  .call(drag);

const nodes = nodeAndText.append("circle").attr("r", 15).attr("fill", "red");
const text = nodeAndText
  .append("text")
  .text((d) => d.name)
  .attr("class", "nodeText");

const simulation = d3
  .forceSimulation(graph.nodes)
  .force(
    "link",
    d3.forceLink(graph.links).id((d) => d.name)
  )
  .force("charge", d3.forceManyBody().strength(-3000))
  .force(
    "center",
    d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
  )
  .on("tick", tick);

function tick() {
  links
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  nodeAndText.attr("transform", (d) => `translate(${d.x},${d.y})`);

  nodeAndText.exit().remove();
  links.exit().remove();
}

// Reheat the simulation when drag starts, and fix the subject position.
function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

// Update the subject (dragged node) position during drag.
function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

// Restore the target alpha so the simulation cools after dragging ends.
// Unfix the subject position now that it’s no longer being dragged.
function dragended(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}
/*getNewData();

const refreshButton = document
  .querySelector("#refresh")
  .addEventListener("click", () => {
    getNewData();
  });

const removeButton = document
  .querySelector("#remove")
  .addEventListener("click", () => {
    deleteNode(1);
  });

function deleteNode(i) {
  graph.nodes[i] = graph.nodes[i + 1];
  graph.nodes.splice(i + 1, 1);
  redraw();
}

function getNewData() {
  const lilli = {
    name: "Lilli",
    location: {
      name: "Hinterdupfingen",
      lat: 47.990841,
      lon: 8.121713,
    },
    age: 27,
  };

  const michi = {
    name: "Michi",
    location: {
      name: "Hinterdupfingen",
      lat: 47.994517,
      lon: 8.248138,
    },
    age: 27,
  };

  const MichiLilli = new Relationship(
    { partner1: michi, partner2: lilli },
    platonic,
    false
  );

  graph.nodes.push(lilli);
  graph.links.push(MichiLilli);

  redraw(graph);
}
*/
