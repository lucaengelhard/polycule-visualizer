import { Link, UserRound, UserRoundPlus, XCircle } from "lucide-react";
import AddPerson from "./AddPerson";
import AddRelationship from "./AddRelationship";

import LinkInfo from "./LinkInfo";
import NodeInfo from "./NodeInfo";

import { ImportDB, SaveDB } from "./SaveLoad";
import UIWindow from "./components/UIWindow";
import Graph from "./graph";
import { ReactNode, createContext, useContext, useState } from "react";
import { EditContext } from "../App";

export const WindowContext = createContext<{
  windowState: { count: number; last?: number };
  setWindowState: React.Dispatch<
    React.SetStateAction<{ count: number; last?: number }>
  >;
}>(undefined);

export function WindowContextProvider({ children }: { children: ReactNode }) {
  const [windowState, setWindowState] = useState<{
    count: number;
    last?: number;
  }>({ count: 0, last: undefined });
  return (
    <WindowContext.Provider value={{ windowState, setWindowState }}>
      {children}
    </WindowContext.Provider>
  );
}

//TODO: Error popup component, last interacted window on top
export default function UI() {
  const { editState, setEditState } = useContext(EditContext);

  return (
    <WindowContextProvider>
      <div>
        <div className="fixed inset-0 z-0">
          <Graph />
        </div>
        <div className="pointer-events-none fixed inset-0 z-10">
          <div className="flex w-full justify-between gap-3 p-3">
            <div className="flex gap-3">
              <UIWindow
                header={{ label: "Add Person:", icon: <UserRoundPlus /> }}
                openButton={{ label: "Add Person", icon: <UserRoundPlus /> }}
                closeButton={{ label: "Close", icon: <XCircle /> }}
              >
                <AddPerson />
              </UIWindow>

              <UIWindow
                header={{ label: "Add Relationship:", icon: <Link /> }}
                openButton={{ label: "Add Relationship", icon: <Link /> }}
                closeButton={{ label: "Close", icon: <XCircle /> }}
              >
                <AddRelationship />
              </UIWindow>
            </div>
            <div className="flex gap-3">
              <SaveDB />
              <ImportDB />
            </div>
          </div>
          <div className="flex h-min w-min gap-3 p-3">
            <UIWindow
              header={{ label: "Person:", icon: <UserRound /> }}
              closeButton={{ label: "Close", icon: <XCircle /> }}
              openCondition={editState.node !== undefined}
              closeAction={() =>
                setEditState({ ...editState, node: undefined })
              }
            >
              <NodeInfo />
            </UIWindow>

            <UIWindow
              header={{ label: "Relationship:", icon: <Link /> }}
              closeButton={{ label: "Close", icon: <XCircle /> }}
              openCondition={editState.link !== undefined}
              closeAction={() =>
                setEditState({ ...editState, link: undefined })
              }
            >
              <LinkInfo />
            </UIWindow>
          </div>
        </div>
      </div>
    </WindowContextProvider>
  );
}
