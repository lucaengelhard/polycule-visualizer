import { Relationship } from "../classes/relationship";
import { GraphData, Person } from "../types/types";

const luca: Person = {
  id: 0,
  name: "Luca",
  location: {
    name: "Vorderdupfingen",
    lat: 47.766099,
    lon: 8.094229,
  },
  relationships: [],
};

const luca2: Person = {
  id: 2,
  name: "Luca2",
  location: {
    name: "Vorderdupfingenn",
    lat: 47.766099,
    lon: 8.094229,
  },
  relationships: [],
};

const michi: Person = {
  id: 1,
  name: "Michi",
  location: {
    name: "Hinterdupfingen",
    lat: 47.994517,
    lon: 8.248138,
  },
  relationships: [],
};

export const db: GraphData = {
  nodes: [luca, michi, luca2],
  links: [],
};

export const graph: GraphData = {
  nodes: [],
  links: [],
};

updateGraphData();

export function updateGraphData() {
  graph.nodes = db.nodes.map((node) => node);
  graph.links = db.links.map((link) => link);
}

export function add({
  type,
  payload,
}: {
  type: "node" | "link";
  payload: typeof type extends "node"
    ? Person
    : typeof type extends "link"
      ? Relationship
      : never;
}) {
  let index: number | undefined = undefined;

  if (type === "node") {
    index = db.nodes.push(payload);
  }

  if (type === "link") {
    index = db.links.push(payload);
  }

  updateGraphData();

  return index;
}
