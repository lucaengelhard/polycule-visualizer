import AddPerson from "./AddPerson";
import AddRelationship from "./AddRelationship";
import NodeInfo from "./NodeInfo";

import { ImportDB, SaveDB } from "./SaveLoad";

export default function UI() {
  return (
    <div>
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

      <div className="h-min w-min p-3">
        <NodeInfo />
        {/*<EditRel />*/}
      </div>
    </div>
  );
}
