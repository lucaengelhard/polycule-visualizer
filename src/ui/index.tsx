import AddPerson from "./AddPerson";
import AddRelationship from "./AddRelationship";

import LinkInfo from "./LinkInfo";
import NodeInfo from "./NodeInfo";

import { ImportDB, SaveDB } from "./SaveLoad";
import Graph from "./graph";

//TODO: Error popup component
export default function UI() {
  return (
    <div>
      <div className="fixed inset-0 z-0">
        <Graph />
      </div>

      <div className="pointer-events-none fixed inset-0 z-10">
        <div className="flex w-full justify-between gap-3 p-3">
          <div className="flex gap-3">
            <AddPerson />
            <AddRelationship />
          </div>
          <div className="flex gap-3">
            <SaveDB />
            <ImportDB />
          </div>
        </div>
        <div className="flex h-min w-min gap-3 p-3">
          <NodeInfo />
          <LinkInfo />
        </div>
      </div>
    </div>
  );
}
