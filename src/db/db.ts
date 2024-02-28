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
    case "nodes": {
      if (!typeCheckNode(payload)) throw new Error("Node Parsing Error");
      break;
    }
    case "links": {
      if (!typeCheckLink(payload)) throw new Error("Link Parsing Error");

      const newSourceLinks: Set<keyof Types.LinkList> = new Set(
        db.nodes[payload.source.id].links,
      );

      newSourceLinks.add(payload.id);
      const newSource: Types.Node = {
        name: payload.source.name,
        links: newSourceLinks,
        id: payload.source.id,
        location: payload.source.location,
      };

      const newTargetLinks: Set<keyof Types.LinkList> = new Set(
        db.nodes[payload.target.id].links,
      );

      newTargetLinks.add(payload.id);
      const newTarget: Types.Node = {
        name: payload.target.name,
        links: newTargetLinks,
        id: payload.target.id,
        location: payload.target.location,
      };

      update("nodes", newSource, "change", false);

      update("nodes", newTarget, "change", false);

      payload.source = newSource;
      payload.target = newTarget;

      break;
    }
    case "linkTypes": {
      if (!typeCheckLinkType(payload))
        throw new Error("Link Type Parsing Error");

      const toChange = Object.values(db.links).filter(
        (link) => link.type.id === payload.id,
      );

      toChange.forEach((link) => {
        const newLink = { ...link };

        if (link.type.color !== payload.color) {
          newLink.type.color = payload.color;
        }

        if (link.type.name !== payload.name) {
          newLink.type.name = payload.name;
        }

        update("links", newLink, "change", false);
      });

      break;
    }
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

  if (render === true || render === undefined) {
    console.log(
      type,
      db,
      render === true || render === undefined ? "render" : "no render",
    );
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
