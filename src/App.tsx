import { createContext, useEffect, useState } from "react";
import UI from "./ui/UI";
import * as Types from "./types/types";
import { db } from "./db/db";
//import { graph } from "./db/db";

export const DBContext = createContext<{
  DBState: Types.DBData;
  setDBState: React.Dispatch<Types.DBData>;
}>(null);

export default function App() {
  const [DBState, setDBState] = useState<Types.DBData>(db);

  useEffect(() => {
    document.addEventListener("dbUpDate", () => {
      //console.log(db.nodes);
      //setDBState({ ...db });
    });

    document.addEventListener("NodeUpdate", () => {
      const changeNodes: Types.NodeList = {};

      for (const Key in db.nodes) {
        if (Object.prototype.hasOwnProperty.call(db.nodes, Key)) {
          const Node = db.nodes[Key];

          if (Node.id in DBState.nodes) {
            const StateNode = DBState.nodes[Node.id];
            if (
              StateNode.name !== Node.name ||
              StateNode.location.name !== Node.location.name ||
              StateNode.relationships !== Node.relationships
            ) {
              changeNodes[Node.id] = Node;
            }
          } else {
            changeNodes[Node.id] = Node;
          }
        }
      }

      setDBState({
        ...DBState,
        nodes: { ...DBState.nodes, ...changeNodes },
      });
    });

    document.addEventListener("LinkUpdate", () => {
      const changeLinks: Types.LinkList = {};

      console.log(db.links);
      console.log(DBState.links);

      for (const Key in db.links) {
        if (Object.prototype.hasOwnProperty.call(db.links, Key)) {
          const Link = db.links[Key];

          if (Link.id in DBState.links) {
            const StateLink = DBState.links[Link.id];
            console.log(StateLink);

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
    });

    document.addEventListener("LinkTypeUpdate", () => {
      const changeLinkTypes: Types.LinkTypeList = {};

      for (const Key in db.linkTypes) {
        if (Object.prototype.hasOwnProperty.call(db.linkTypes, Key)) {
          const LinkType = db.linkTypes[Key];

          if (LinkType.id in DBState.nodes) {
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

      setDBState({
        ...DBState,
        linkTypes: { ...DBState.linkTypes, ...changeLinkTypes },
      });
    });
  });

  return (
    <DBContext.Provider value={{ DBState, setDBState }}>
      <UI />
    </DBContext.Provider>
  );
}
