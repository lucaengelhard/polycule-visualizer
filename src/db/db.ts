import { Relationship } from "../classes/relationship";

import * as Types from "../types/types";

const luca: Types.Person = {
  id: 0,
  name: "Luca",
  location: {
    name: "Vorderdupfingen",
    lat: 47.766099,
    lon: 8.094229,
  },
  relationships: [],
};

const luca2: Types.Person = {
  id: 2,
  name: "Luca2",
  location: {
    name: "Vorderdupfingenn",
    lat: 47.766099,
    lon: 8.094229,
  },
  relationships: [],
};

const michi: Types.Person = {
  id: 1,
  name: "Michi",
  location: {
    name: "Hinterdupfingen",
    lat: 47.994517,
    lon: 8.248138,
  },
  relationships: [],
};

const MichiLuca = new Relationship(
  { partner1: michi, partner2: luca },
  { name: "romantic", color: "#c66a55", id: 0 },
  false,
);

export const db: Types.DBData = {
  nodes: [luca, michi, luca2],
  links: [MichiLuca],
};

export const graph: Types.GraphData = {
  nodes: [],
  links: [],
};

updateGraphData();

export function updateGraphData() {
  graph.nodes = db.nodes.map((node) => node);
  graph.links = db.links.map((link) => link);

  const event = new Event("onGraphUpdate");
  document.dispatchEvent(event);
}

export function add({
  type,
  payload,
}: {
  type: "node" | "link";
  payload: typeof type extends "node"
    ? Types.Person
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

export function set(input: unknown) {
  let res = input;
  if (typeof input === "string") {
    res = JSON.parse(input);
  }

  if (checkGraphDataType(res)) {
    db.links = res.links.map((link) => {
      return {
        ...link,
        source: typeof link.source !== "number" ? link.source.id : link.source,
        target: typeof link.target !== "number" ? link.target.id : link.target,
      };
    });

    db.nodes = res.nodes;
    updateGraphData();
  } else {
    throw new Error("Parsing Error");
  }
}

export function checkGraphDataType(input: unknown): input is Types.GraphData {
  if ((input as Types.GraphData).links === undefined) {
    return false;
  }

  if ((input as Types.GraphData).links.length > 0) {
    if (
      (input as Types.GraphData).links[0].source === undefined ||
      (input as Types.GraphData).links[0].target === undefined ||
      (input as Types.GraphData).links[0].distance === undefined
    ) {
      return false;
    }
  }

  if ((input as Types.GraphData).nodes === undefined) {
    return false;
  }

  if ((input as Types.GraphData).nodes.length > 0) {
    if (
      (input as Types.GraphData).nodes[0].name === undefined ||
      (input as Types.GraphData).nodes[0].id === undefined ||
      (input as Types.GraphData).nodes[0].location === undefined
    ) {
      return false;
    }
  }

  return true;
}
