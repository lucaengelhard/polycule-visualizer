import { Types } from "../types";
import { useContext, useEffect, useRef } from "react";
import { DBContext, EditContext } from "../App";
import { hexToRGBA } from "../utils/helpers";
import { Pencil, Trash2, History as LucideHistory } from "lucide-react";

import { geoCode } from "../utils/geocode";
import { Button, TextInput } from "./components";

import useConfirm from "./components/ConfirmDialog";
import { update, remove } from "../db/db";
import { HistoryNode } from "@/types/types";

export default function NodeInfo() {
  const { editState, setEditState } = useContext(EditContext);
  const { DBState } = useContext(DBContext);
  let node: Types.Node | undefined = undefined;
  let historyNode: HistoryNode | undefined = undefined;
  let isHistory = false;

  const nameRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const confirm = useConfirm();

  if (
    editState.node !== undefined &&
    DBState.nodes[editState.node] !== undefined
  ) {
    node = DBState.nodes[editState.node];
  }

  if (
    node !== undefined &&
    node.history !== undefined &&
    editState.nodeHistory !== undefined &&
    node.history[editState.nodeHistory] !== undefined
  ) {
    isHistory = true;
    historyNode = node.history[editState.nodeHistory];
    if (placeRef.current !== null) {
      placeRef.current.value = historyNode.location.name;
    }
  }

  useEffect(() => {
    if (nameRef.current !== null && node !== undefined) {
      nameRef.current.value = node.name;
    }

    if (placeRef.current !== null && node !== undefined) {
      placeRef.current.value = node.location.name;
    }
  }, [node]);

  function updateName(event: React.ChangeEvent<HTMLInputElement>) {
    if (node === undefined) return;
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
    if (node === undefined) return;
    if (event.target.value === node.location.name) {
      return;
    }

    if (editState.node !== undefined) {
      if (event.target.value.length === 0)
        throw new Error("String of length 0 not allowed");

      if (
        isHistory &&
        historyNode !== undefined &&
        node.history !== undefined
      ) {
        const newLocation = await geoCode(event.target.value);
        update(
          "nodes",
          {
            ...node,
            history: {
              ...node.history,
              [historyNode.id]: {
                ...node.history[historyNode.id],
                location: {
                  name: event.target.value,
                  lat: newLocation.lat,
                  lon: newLocation.lon,
                },
              },
            },
          },
          "change",
          true,
        );
        return;
      }

      console.log("current");

      const newLocation = await geoCode(event.target.value);
      update(
        "nodes",
        {
          ...node,
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
    if (node === undefined) return;
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
          <TextInput
            ref={nameRef}
            onBlur={updateName}
            defaultValue={
              historyNode === undefined ? node.name : historyNode.name
            }
          />
          <TextInput
            ref={placeRef}
            onBlur={updateLocation}
            defaultValue={
              historyNode === undefined
                ? node.location.name
                : historyNode.location.name
            }
          />
          {Array.from(node.links).length > 0 && <div>Relationships:</div>}
          {editState.node !== undefined && (
            <div>
              {Array.from(node.links).map((linkId) => (
                <NodeRelListItem
                  key={linkId}
                  linkId={linkId}
                  editNode={node as Types.Node}
                />
              ))}
            </div>
          )}
          <div className="flex justify-between">
            {isHistory && historyNode !== undefined && (
              <div className="rounded-lg bg-white p-3 shadow-lg">
                {new Date(historyNode.date).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </div>
            )}
            <Button
              icon={<LucideHistory />}
              onClick={() =>
                setEditState({ ...editState, nodeHistoryOpen: true })
              }
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
