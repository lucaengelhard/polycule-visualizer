import ClassLink from "../classes/link";
import {
  checkGraphDataType,
  typeCheckNode,
  typeCheckLink,
  typeCheckLinkType,
} from "../types/typechecks";

import { Types } from "../types";
import { bufferTimeCalculator, getNewIndex } from "../utils/helpers";

export const db: Types.DBData = {
  nodes: {},
  links: {},
  linkTypes: {},
};

export const noLink: Types.LinkType = {
  name: "noLink",
  id: -1,
  color: "#ffffff",
};

const dbUpDate = new Event("dbUpDate");
const NodeUpDate = new Event("NodeUpdate");
const LinkUpdate = new Event("LinkUpdate");
const LinkTypeUpdate = new Event("LinkTypeUpdate");

const DBRenderTimes: Types.DBRenderTimes = {
  nodes: undefined,
  links: undefined,
  linkTypes: undefined,
};

const DBBufferStatus: Types.DBBufferStatus = {
  nodes: undefined,
  links: undefined,
  linkTypes: undefined,
};

export function update(
  type: "nodes" | "links" | "linkTypes",
  payload: unknown,
  action: "add" | "change",
  render?: boolean,
) {
  switch (type) {
    case "nodes": {
      if (!typeCheckNode(payload)) throw new Error("Node Parsing Error");

      if (action === "change") {
        Array.from(payload.links).forEach((id) => {
          if (
            db.links[id] !== undefined &&
            db.nodes[payload.id] !== undefined &&
            (payload.name !== db.nodes[payload.id].name ||
              payload.location.name !== db.nodes[payload.id].location.name)
          ) {
            let newSource: Types.Node = db.links[id].source;
            let newTarget: Types.Node = db.links[id].target;
            if (db.links[id].source.id === payload.id) {
              newSource = payload;
            } else {
              newSource = db.links[id].source;
            }

            if (db.links[id].target.id === payload.id) {
              newTarget = payload;
            } else {
              newTarget = db.links[id].target;
            }

            db.links[id] = new ClassLink(
              { partner1: newSource, partner2: newTarget },
              db.links[id].type,
            );
          }
        });
      }

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

      if (
        action === "change" &&
        db.linkTypes[payload.id] !== undefined &&
        payload.color === db.linkTypes[payload.id].color &&
        payload.name === db.linkTypes[payload.id].name
      ) {
        render = false;
      }

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
    if (
      DBRenderTimes[type] !== undefined &&
      bufferTimeCalculator(DBRenderTimes[type] as Date, 10)
    ) {
      DBBufferStatus[type] = true;
      setTimeout(() => {
        if (DBBufferStatus[type]) {
          //console.log(type);
          DBBufferStatus[type] = false;
          document.dispatchEvent(dbUpDate);
        }
      }, 3000);
      return length;
    }

    console.log(
      type,
      db,
      render === true || render === undefined ? "render" : "no render",
    );

    DBRenderTimes[type] = new Date();
    DBBufferStatus[type] = false;
    triggerEvent(type);
  }

  return length;
}

function triggerEvent(type: "nodes" | "links" | "linkTypes") {
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

export function set(input: unknown, render?: boolean) {
  let res = input;
  if (typeof input === "string") {
    res = JSON.parse(input);
  }

  if (checkGraphDataType(res)) {
    db.nodes = importNodesToDBNodes(res.nodes);
    db.links = importLinksToDBLinks(res.links);
    db.linkTypes = res.linkTypes;

    if (render === true || render === undefined) {
      document.dispatchEvent(dbUpDate);
    }
  } else {
    throw new Error("Parsing Error");
  }
}

function importNodesToDBNodes(importNodes: Types.NodeList): Types.NodeList {
  const returnNodes = importNodes;

  Object.values(importNodes).forEach((node) => {
    returnNodes[node.id].links = new Set(node.links);
  });

  return returnNodes;
}

function importLinksToDBLinks(importLinks: Types.LinkList): Types.LinkList {
  const returnLinks = importLinks;

  Object.values(importLinks).forEach((link) => {
    returnLinks[link.id].source.links = new Set(link.source.links);
    returnLinks[link.id].target.links = new Set(link.target.links);
  });

  return returnLinks;
}

export function remove<T extends Types.DBType>(payload: T, render?: boolean) {
  if (typeCheckNode(payload)) {
    delete db.nodes[payload.id];

    if (Array.from(payload.links).length > 0) {
      for (const key in db.links) {
        if (Object.prototype.hasOwnProperty.call(db.links, key)) {
          const link = db.links[key];

          if (link.source.id === payload.id || link.target.id === payload.id) {
            remove(db.links[key], false);
          }
        }
      }
    }

    if (render === true || render === undefined) {
      document.dispatchEvent(NodeUpDate);
    }
  }

  if (typeCheckLink(payload)) {
    delete db.links[payload.id];

    for (const key in db.nodes) {
      if (Object.prototype.hasOwnProperty.call(db.nodes, key)) {
        const node = db.nodes[key];

        if (node.links.has(payload.id)) {
          node.links.delete(payload.id);
        }
      }
    }

    if (render === true || render === undefined) {
      document.dispatchEvent(LinkUpdate);
    }
  }

  if (typeCheckLinkType(payload)) {
    delete db.linkTypes[payload.id];

    for (const key in db.links) {
      if (Object.prototype.hasOwnProperty.call(db.links, key)) {
        const link = db.links[key];

        if (
          link.type.id === payload.id &&
          Object.keys(db.linkTypes).length > 0
        ) {
          db.links[key].type =
            db.linkTypes[
              typeof Object.keys(db.linkTypes)[0] === "string"
                ? parseInt(Object.keys(db.linkTypes)[0])
                : typeof Object.keys(db.linkTypes)[0] === "number"
                  ? (Object.keys(db.linkTypes)[0] as unknown as number)
                  : 0
            ];
        } else if (link.type.id === payload.id) {
          const fallbackType: Types.LinkType = {
            name: "Relationship Type",
            color: "#777777",
            id: 0,
          };

          db.linkTypes = { [fallbackType.id]: fallbackType };
          db.links[key].type = fallbackType;

          console.log(db.linkTypes);
        }
      }
    }

    if (render === true || render === undefined) {
      document.dispatchEvent(LinkTypeUpdate);
    }
  }
}
