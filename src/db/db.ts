import {
  checkGraphDataType,
  typeCheckNode,
  typeCheckLink,
  typeCheckLinkType,
} from "../types/typechecks";

import * as Types from "../types/types";
import { getNewIndex } from "../utils/helpers";

export const db: Types.DBData = {
  nodes: {},
  links: {},
  linkTypes: {},
};

const dbUpDate = new Event("dbUpDate");
const NodeUpDate = new Event("NodeUpdate");
const LinkUpdate = new Event("LinkUpdate");
const LinkTypeUpdate = new Event("LinkTypeUpdate");

export function update(
  type: "nodes" | "links" | "linkTypes",
  payload: unknown,
  action: "add" | "change",
  render?: boolean,
) {
  switch (type) {
    case "nodes":
      if (!typeCheckNode(payload)) throw new Error("Node Parsing Error");
      break;
    case "links":
      if (typeCheckLink(payload)) {
        const newSource: Types.Node = {
          name: payload.source.name,
          links: [...db.nodes[payload.source.id].links, payload.id],
          id: payload.source.id,
          location: payload.source.location,
        };

        const newTarget: Types.Node = {
          name: payload.target.name,
          links: [...db.nodes[payload.target.id].links, payload.id],
          id: payload.target.id,
          location: payload.target.location,
        };

        update("nodes", newSource, "change", false);

        update("nodes", newTarget, "change", false);

        payload.source = newSource;
        payload.target = newTarget;
      } else {
        throw new Error("Link Parsing Error");
      }

      break;
    case "linkTypes":
      if (!typeCheckLinkType(payload))
        throw new Error("Link Type Parsing Error");
      break;
    default:
      throw new Error("No type defined");
  }

  let length: number | undefined = undefined;
  let i = payload.id;

  if (action === "add") {
    i = getNewIndex(db[type]);
    payload.id = i;
  }

  db[type][i] = payload;
  length = Object.keys(db[type]).length;

  console.log(
    type,
    db,
    render === true || render === undefined ? "render" : "no render",
  );

  if (render === true || render === undefined) {
    switch (type) {
      case "nodes":
        document.dispatchEvent(NodeUpDate);
        break;
      case "links":
        document.dispatchEvent(LinkUpdate);
        break;
      case "linkTypes":
        document.dispatchEvent(LinkTypeUpdate);
        break;
      default:
        document.dispatchEvent(dbUpDate);
        break;
    }
  }

  return length;
}

export function set(input: unknown, render?: boolean) {
  let res = input;
  if (typeof input === "string") {
    res = JSON.parse(input);
  }

  if (checkGraphDataType(res)) {
    db.nodes = res.nodes;
    db.links = res.links;
    db.linkTypes = res.linkTypes;

    if (render === true || render === undefined) {
      document.dispatchEvent(dbUpDate);
    }
  } else {
    throw new Error("Parsing Error");
  }
}
