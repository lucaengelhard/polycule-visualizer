import { TextInput } from "./Components";
import * as Types from "../types/types";
import { useContext } from "react";
import { DBContext, EditContext } from "../App";
import { hexToRGBA } from "../utils/helpers";
import { Pencil } from "lucide-react";

export default function NodeInfo() {
  const { editState, setEditState } = useContext(EditContext);

  return (
    <>
      {editState.node !== undefined && (
        <div className="grid gap-3 rounded-lg bg-white p-3 shadow-lg">
          <TextInput defaultValue={editState.node.name} />
          <TextInput defaultValue={editState.node.location.name} />
          <div>Relationships:</div>
          {editState.node !== undefined && (
            <div>
              {Array.from(editState.node.links).map((linkId) => (
                <NodeRelListItem
                  key={linkId}
                  linkId={linkId}
                  editNode={editState.node as Types.Node}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function NodeRelListItem({
  linkId,
  editNode,
}: {
  linkId: number;
  editNode: Types.Node;
}) {
  const { DBState } = useContext(DBContext);

  const divStyle = {
    backgroundColor:
      hexToRGBA(
        DBState.links[linkId] ? DBState.links[linkId].type.color : "#ffffff",
        0.5,
      ) ?? "#ffffff",
  };
  return (
    <>
      {DBState.links[linkId] && (
        <div
          className="group mt-3 flex cursor-pointer items-center justify-between rounded-lg p-3 shadow-lg transition-transform first:mt-0 hover:translate-x-2"
          style={divStyle}
        >
          <div>
            <div className="font-bold">
              {DBState.links[linkId].source.name !== editNode.name
                ? DBState.links[linkId].source.name
                : DBState.links[linkId].target.name}
            </div>
            <div>
              {DBState.links[linkId].source.name !== editNode.name
                ? DBState.links[linkId].source.location.name
                : DBState.links[linkId].target.location.name}
            </div>
          </div>
          <Pencil
            className="opacity-0 transition-opacity group-hover:opacity-100"
            size={22}
          />
        </div>
      )}
    </>
  );
}
