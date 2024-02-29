import { createContext, useEffect, useState } from "react";
import UI from "./ui";
import * as Types from "./types";
import { db } from "./db";

export const DBContext = createContext<{
  DBState: Types.DBData;
  setDBState: React.Dispatch<Types.DBData>;
}>(null);

export const EditContext = createContext<{
  editState: {
    node?: keyof Types.NodeList | undefined;
    link?: keyof Types.LinkList | undefined;
  };
  setEditState: React.Dispatch<
    React.SetStateAction<{
      node?: keyof Types.NodeList | undefined;
      link?: keyof Types.LinkList | undefined;
    }>
  >;
}>(null);

export default function App() {
  const [DBState, setDBState] = useState<Types.DBData>(db);
  const [editState, setEditState] = useState<{
    node?: keyof Types.NodeList;
    link?: keyof Types.LinkList;
  }>({
    node: undefined,
    link: undefined,
  });

  useEffect(() => {
    document.addEventListener("dbUpDate", () => {
      console.log(db);
      setDBState({ ...db });
    });

    document.addEventListener("NodeUpdate", () => {
      NodeUpdate(DBState, setDBState);
    });

    document.addEventListener("LinkUpdate", () => {
      LinkUpdate(DBState, setDBState);
      NodeUpdate(DBState, setDBState);
    });

    document.addEventListener("LinkTypeUpdate", () => {
      LinkTypeUpdate(DBState, setDBState);
    });
  });

  return (
    <EditContext.Provider value={{ editState, setEditState }}>
      <DBContext.Provider value={{ DBState, setDBState }}>
        <UI />
      </DBContext.Provider>
    </EditContext.Provider>
  );
}

export function LinkTypeUpdate(
  DBState: Types.DBData,
  setDBState: React.Dispatch<Types.DBData>,
) {
  const changeLinkTypes: Types.LinkTypeList = {};

  for (const Key in db.linkTypes) {
    if (Object.prototype.hasOwnProperty.call(db.linkTypes, Key)) {
      const LinkType = db.linkTypes[Key];

      if (LinkType.id in DBState.linkTypes) {
        const StateLinkType = DBState.linkTypes[LinkType.id];

        if (
          StateLinkType.name !== LinkType.name ||
          StateLinkType.color !== LinkType.color
        ) {
          changeLinkTypes[LinkType.id] = LinkType;
        }
      } else {
        changeLinkTypes[LinkType.id] = LinkType;
      }
    }
  }

  if (
    Object.keys(DBState.linkTypes).length <= Object.keys(db.linkTypes).length
  ) {
    setDBState({
      ...DBState,
      linkTypes: { ...DBState.linkTypes, ...changeLinkTypes },
    });
  } else {
    setDBState({
      ...DBState,
      linkTypes: db.linkTypes,
    });
  }
}

function LinkUpdate(
  DBState: Types.DBData,
  setDBState: React.Dispatch<Types.DBData>,
) {
  const changeLinks: Types.LinkList = {};

  for (const Key in db.links) {
    if (Object.prototype.hasOwnProperty.call(db.links, Key)) {
      const Link = db.links[Key];

      if (Link.id in DBState.links) {
        const StateLink = DBState.links[Link.id];

        if (
          StateLink.source.id !== Link.source.id ||
          StateLink.target.id !== Link.target.id ||
          StateLink.type.id !== Link.type.id ||
          StateLink.type.color !== Link.type.color ||
          StateLink.type.name !== Link.type.name ||
          StateLink.distance !== Link.distance
        ) {
          changeLinks[Link.id] = Link;
        }
      } else {
        changeLinks[Link.id] = Link;
      }
    }
  }

  setDBState({
    ...DBState,
    links: { ...DBState.links, ...changeLinks },
  });
}

function NodeUpdate(
  DBState: Types.DBData,
  setDBState: React.Dispatch<Types.DBData>,
) {
  const changeNodes: Types.NodeList = {};

  for (const Key in db.nodes) {
    if (Object.prototype.hasOwnProperty.call(db.nodes, Key)) {
      const Node = db.nodes[Key];

      if (Node.id in DBState.nodes) {
        const StateNode = DBState.nodes[Node.id];
        if (
          StateNode.name !== Node.name ||
          StateNode.location.name !== Node.location.name ||
          StateNode.links !== Node.links
        ) {
          changeNodes[Node.id] = Node;
        }
      } else {
        changeNodes[Node.id] = Node;
      }
    }
  }

  if (Object.keys(DBState.nodes).length <= Object.keys(db.nodes).length) {
    setDBState({
      ...DBState,
      nodes: { ...DBState.nodes, ...changeNodes },
    });
  } else {
    setDBState({
      ...DBState,
      nodes: db.nodes,
    });
  }
}
