import Link from "../classes/link";
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
  payload: Types.Node | Link | Types.LinkType,
  action: "add" | "change",
) {
  switch (type) {
    case "nodes":
      typeCheckNode(payload);
      break;
    case "links":
      typeCheckLink(payload);
      break;
    case "linkTypes":
      typeCheckLinkType(payload);
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

  return length;
}

export function set(input: unknown) {
  let res = input;
  if (typeof input === "string") {
    res = JSON.parse(input);
  }

  if (checkGraphDataType(res)) {
    db.nodes = res.nodes;
    db.links = res.links;
    db.linkTypes = res.linkTypes;

    document.dispatchEvent(dbUpDate);
  } else {
    throw new Error("Parsing Error");
  }
}
