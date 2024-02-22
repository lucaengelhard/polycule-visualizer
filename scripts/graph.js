import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { graph } from "../dist/index.mjs";
import { clamp } from "../dist/helpers.mjs";

const canvas = d3.select("#canvas");
canvas.attr("width", window.innerWidth).attr("height", window.innerHeight);
const links = graph.links.map((d) => ({ ...d }));
const nodes = graph.nodes.map((d) => ({ ...d }));

const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3
      .forceLink(links)
      .id((d) => d.id)
      .distance((d) => d.distance)
  )
  .force("charge", d3.forceManyBody().strength(-3000))
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .force(
    "center",
    d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
  );

const linkGroup = canvas
  .append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6);

const nodeGroup = canvas
  .append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5);

// Add a line for each link, and a circle for each node.
let link = linkGroup
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke-width", (d) => clamp(d.type.value, 1, 5));

let node = nodeGroup
  .selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("r", 10)
  .attr("fill", "red");

let titles = node.append("title").text((d) => d.name);

node.call(
  d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
);

simulation.on("tick", ticked);

let chart = Object.assign(canvas.node(), {
  update(nodes, links) {
    // Make a shallow copy to protect against mutation, while
    // recycling old nodes to preserve position and velocity.
    const old = new Map(node.data().map((d) => [d.name, d]));
    nodes = nodes.map((d) => Object.assign(old.get(d.id) || {}, d));
    links = links.map((d) => Object.assign({}, d));

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

    node = node
      .data(nodes)
      .join(
        (enter) => {
          let node = enter.append("circle").attr("r", 10).attr("fill", "red");
          let title = node.append("title").text((d) => d.name);
          return node;
        },
        (update) => update,
        (exit) => exit.remove()
      )
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    link = link
      .data(links, (d) => `${d.source.id}\t${d.target.id}`)
      .join("line");
  },
});

setTimeout(() => {
  const lilli = {
    name: "Lilli",
    location: {
      name: "Hinterdupfingen",
      lat: 47.990841,
      lon: 8.121713,
    },
    age: 27,
  };

  nodes.push(lilli);

  chart.update(nodes, links);
}, 3000);

function ticked() {
  link
    .attr("x1", (d) => {
      //console.log(d);
      return d.source.x;
    })
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node
    .attr("cx", (d) => {
      return d.x;
    })
    .attr("cy", (d) => d.y);
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
