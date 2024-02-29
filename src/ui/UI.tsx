import { useContext } from "react";
import { DBContext } from "../App";
import AddPerson from "./AddPerson";
import AddRelationship from "./AddRelationship";
import { Button } from "./Components";
import LinkInfo from "./LinkInfo";
import NodeInfo from "./NodeInfo";

import { ImportDB, SaveDB } from "./SaveLoad";
import { remove } from "../db/db";

export default function UI() {
  const { DBState } = useContext(DBContext);
  function deleteFirstLinkType() {
    remove(DBState.linkTypes[0], true);

    setTimeout(() => {
      remove(DBState.linkTypes[1], true);
    }, 3000);
  }

  return (
    <div>
      <div className="flex w-full justify-between gap-3 p-3">
        <div className="flex gap-3">
          <AddPerson />
          <AddRelationship />
          <Button label="delete linktype test" onClick={deleteFirstLinkType} />
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
  );
}
