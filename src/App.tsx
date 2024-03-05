import { createContext, useMemo, useState } from "react";
import UI from "@/ui";
import { DB } from "@/db";
import { TypeChecks, Types } from "@/types";
import Link from "@/classes/link";

export const NodeStateContext = createContext(DB.data.nodes);
export const LinkStateContext = createContext(DB.data.links);
export const TypeStateContext = createContext(DB.data.types);
//TODO: Window Manager

export default function App() {
  const [DBState, setDBState] = useState(DB.data);
  const NodeState = useMemo(() => DBState.nodes, [DBState.nodes]);
  const LinkState = useMemo(() => DBState.links, [DBState.links]);
  const TypeState = useMemo(() => DBState.types, [DBState.types]);

  document.addEventListener("db-update", (event) => {
    if (
      "detail" in event &&
      event.detail !== null &&
      typeof event.detail === "object" &&
      "id" in event.detail &&
      event.detail.id !== null &&
      typeof event.detail.id === "number" &&
      "type" in event.detail &&
      event.detail.type !== null &&
      typeof event.detail.type === "string"
    ) {
      let node: Types.Node | undefined = undefined;
      let link: Link | undefined = undefined;
      let type: Types.Type | undefined = undefined;
      switch (event.detail.type) {
        case "node":
          node = DB.data.nodes.get(event.detail.id);
          if (node === undefined) return;

          setDBState({
            ...DBState,
            nodes: new Map(DBState.nodes.set(node.id, node)),
          });
          break;

        case "link":
          link = DB.data.links.get(event.detail.id);
          if (link === undefined) return;

          setDBState({
            ...DBState,
            links: new Map(DBState.links.set(link.id, link)),
          });
          break;

        case "type":
          type = DB.data.types.get(event.detail.id);
          if (type === undefined) return;

          setDBState({
            ...DBState,
            types: new Map(DBState.types.set(type.id, type)),
          });
          break;

        default:
          break;
      }
    } else {
      console.error("Error while inserting");
    }
  });

  document.addEventListener("db-remove", (event) => {
    if (
      "detail" in event &&
      event.detail !== null &&
      typeof event.detail === "object" &&
      "id" in event.detail &&
      event.detail.id !== null &&
      typeof event.detail.id === "number" &&
      "type" in event.detail &&
      event.detail.type !== null &&
      typeof event.detail.type === "string"
    ) {
      let nodes: Map<number, Types.Node> | undefined = undefined;
      let links: Map<number, Link> | undefined = undefined;
      let types: Map<number, Types.Type> | undefined = undefined;
      switch (event.detail.type) {
        case "node":
          nodes = new Map(DBState.nodes);
          nodes.delete(event.detail.id);
          setDBState({ ...DBState, nodes: new Map(nodes) });
          break;

        case "links":
          links = new Map(DBState.links);
          links.delete(event.detail.id);
          setDBState({ ...DBState, links: new Map(links) });
          break;

        case "types":
          types = new Map(DBState.types);
          types.delete(event.detail.id);
          setDBState({ ...DBState, types: new Map(types) });
          break;

        default:
          console.error("Error while inserting");
          break;
      }
    } else {
      console.error("Error while inserting");
    }
  });

  document.addEventListener("db-add", (event) => {
    if (
      "detail" in event &&
      event.detail !== null &&
      typeof event.detail === "object" &&
      "payload" in event.detail &&
      event.detail.payload !== null &&
      "type" in event.detail &&
      event.detail.type !== null &&
      typeof event.detail.type === "string"
    ) {
      switch (event.detail.type) {
        case "node":
          if (TypeChecks.node(event.detail.payload)) {
            const node = DB.data.nodes.get(event.detail.payload.id);
            if (node === undefined) return;

            setDBState({
              ...DBState,
              nodes: new Map(DBState.nodes.set(node.id, node)),
            });
          }
          break;
        case "link":
          if (TypeChecks.link(event.detail.payload)) {
            const link = DB.data.links.get(event.detail.payload.id);
            if (link === undefined) return;

            setDBState({
              ...DBState,
              links: new Map(DBState.links.set(link.id, link)),
            });
          }
          break;

        case "type":
          if (TypeChecks.type(event.detail.payload)) {
            const type = DB.data.types.get(event.detail.payload.id);
            if (type === undefined) return;

            setDBState({
              ...DBState,
              types: new Map(DBState.types.set(type.id, type)),
            });
          }
          break;
        default:
          console.error("Error while inserting");
          break;
      }
    } else {
      console.error("Error while inserting");
    }
  });

  return (
    <NodeStateContext.Provider value={NodeState}>
      <LinkStateContext.Provider value={LinkState}>
        <TypeStateContext.Provider value={TypeState}>
          <UI />
        </TypeStateContext.Provider>{" "}
      </LinkStateContext.Provider>
    </NodeStateContext.Provider>
  );
}
