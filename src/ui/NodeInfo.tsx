import * as Types from "../types";
import { useContext, useEffect, useRef, useState } from "react";
import { DBContext, EditContext } from "../App";
import { hexToRGBA } from "../utils/helpers";
import { Pencil, Trash2, UserRound, XCircle } from "lucide-react";
import { remove, update } from "../db";
import { geoCode } from "../utils/geocode";
import { Button, TextInput, WindowTitle } from "./components";

import useConfirm from "./components/ConfirmDialog";

export default function NodeInfo() {
  const { editState, setEditState } = useContext(EditContext);
  const { DBState } = useContext(DBContext);
  const [node, setNode] = useState(DBState.nodes[editState.node ?? -1]);
  const nameRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const confirm = useConfirm();

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
    if (event.target.value === node.name) {
      return;
    }

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

  async function updateLocation(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value === node.location.name) {
      return;
    }

    if (editState.node !== undefined) {
      if (event.target.value.length === 0)
        throw new Error("String of length 0 not allowed");

      const newLocation = await geoCode(event.target.value);
      update(
        "nodes",
        {
          name: node.name,
          location: {
            name: event.target.value,
            lat: newLocation.lat,
            lon: newLocation.lon,
          },
          id: node.id,
          links: new Set(node.links),
        },
        "change",
      );
    }
  }

  async function deleteNode() {
    const choice = await confirm({
      title: `Delete ${node.name}`,
      description: `Are you sure you want to delete Person ${node.name} and all their relationships?`,
      confirmBtnLabel: "Yes",
    });

    if (choice) {
      if (editState.link !== undefined && node.links !== undefined) {
        if (Array.isArray(node.links) && node.links.includes(editState.link)) {
          setEditState({ node: undefined, link: undefined });
        } else if (node.links.has(editState.link)) {
          setEditState({ node: undefined, link: undefined });
        }
      }

      remove(node, true);
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
          <TextInput
            ref={placeRef}
            onBlur={updateLocation}
            defaultValue={node.location.name}
          />
          {Array.from(node.links).length > 0 && <div>Relationships:</div>}
          {editState.node !== undefined && (
            <div>
              {Array.from(node.links).map((linkId) => (
                <NodeRelListItem key={linkId} linkId={linkId} editNode={node} />
              ))}
            </div>
          )}
          <div className="flex justify-between">
            <Button
              label="Close"
              icon={<XCircle />}
              type="deny"
              onClick={() => {
                setEditState({ ...editState, node: undefined });
              }}
            />
            <Button type="deny" icon={<Trash2 />} onClick={deleteNode} />
          </div>
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
          className="group pointer-events-auto mt-3 flex cursor-pointer items-center justify-between rounded-lg p-3 shadow-lg transition-transform first:mt-0 hover:translate-x-2"
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
