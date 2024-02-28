import { Button, TextInput, WindowTitle } from "./Components";
import * as Types from "../types/types";
import { useContext, useEffect, useRef, useState } from "react";
import { DBContext, EditContext } from "../App";
import { hexToRGBA } from "../utils/helpers";
import { Pencil, UserRound, XCircle } from "lucide-react";
import { update } from "../db/db";

export default function NodeInfo() {
  const { editState, setEditState } = useContext(EditContext);
  const { DBState } = useContext(DBContext);
  const [node, setNode] = useState(DBState.nodes[editState.node ?? -1]);
  const nameRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNode(DBState.nodes[editState.node ?? -1]);
  }, [DBState.nodes, editState.node]);

  useEffect(() => {
    if (nameRef.current !== null) {
      nameRef.current.value = node.name;
    }

    if (placeRef.current !== null) {
      placeRef.current.value = node.location.name;
    }
  }, [node]);

  function updateName(event: React.ChangeEvent<HTMLInputElement>) {
    if (editState.node !== undefined) {
      if (event.target.value.length === 0)
        throw new Error("String of length 0 not allowed");
      update(
        "nodes",
        {
          name: event.target.value,
          location: node.location,
          id: node.id,
          links: new Set(node.links),
        },
        "change",
      );
    }
  }

  return (
    <>
      {node !== undefined && (
        <div className="grid h-min gap-3 rounded-lg bg-white p-3 shadow-lg">
          <WindowTitle label="Person:" icon={<UserRound />} />
          <TextInput
            ref={nameRef}
            onBlur={updateName}
            defaultValue={node.name}
          />
          <TextInput ref={placeRef} defaultValue={node.location.name} />
          {Array.from(node.links).length > 0 && <div>Relationships:</div>}
          {editState.node !== undefined && (
            <div>
              {Array.from(node.links).map((linkId) => (
                <NodeRelListItem key={linkId} linkId={linkId} editNode={node} />
              ))}
            </div>
          )}
          <Button
            label="Close"
            icon={<XCircle />}
            type="deny"
            onClick={() => {
              setEditState({ ...editState, node: undefined });
            }}
          />
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
  const { editState, setEditState } = useContext(EditContext);

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
          onClick={() => setEditState({ ...editState, link: linkId })}
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
