import { NodeStateContext } from "@/App";
import { Input } from "@/components/ui/input";
import { Types } from "@/types";
import { useContext, useState } from "react";
import { DatePicker } from "./components";

export default function NodeList() {
  const Nodes = useContext(NodeStateContext);
  //TODO: is it possible to scroll to specific key?
  return (
    <div className="grid gap-3">
      {Array.from(Nodes.values()).map((node) => (
        <NodeListItem key={node.id} node={node} />
      ))}
    </div>
  );
}

function NodeListItem({ node }: { node: Types.Node }) {
  const [expanded, setExpadend] = useState(true);

  function toggleSelected() {
    if (expanded) setExpadend(false);
    if (!expanded) setExpadend(true);
  }
  //TODO: Animate on expand
  return (
    <div>
      <div
        onClick={toggleSelected}
        className="group flex cursor-pointer select-none justify-between gap-3 rounded-md p-2 shadow-md transition-transform hover:translate-x-2"
      >
        <div>
          <div className="font-bold">{node.name}</div>
          <div>{node.location.name}</div>
        </div>
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          Icon
        </div>
      </div>
      {expanded && <NodeInfo node={node} />}
    </div>
  );
}

function NodeInfo({ node }: { node: Types.Node }) {
  function onNameChange() {}

  function onLocationChange() {}

  function onDateChange() {}

  //TODO: Select Snapshot dropdown?
  return (
    <div className="grid grid-cols-2 gap-2 p-1">
      <div>Name:</div>
      <Input onBlur={onNameChange} defaultValue={node.name} />
      <div>Location:</div>
      <Input onBlur={onLocationChange} defaultValue={node.location.name} />
      <div>Date:</div>
      <DatePicker onDateChange={onDateChange} />
    </div>
  );
}
