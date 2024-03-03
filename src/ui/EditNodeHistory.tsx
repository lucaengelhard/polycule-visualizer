import { DBContext, EditContext } from "@/App";
import { Types } from "@/types";
import { useContext, useRef, useState } from "react";
import { DatePicker } from "./components/Datepicker";
import { LucideHistory } from "lucide-react";
import { Button, TextInput } from "./components";
import { geoCode } from "@/utils/geocode";
import { update } from "@/db/db";

export default function EditNodeHistory({ nodeID }: { nodeID: number }) {
  const { DBState } = useContext(DBContext);
  const node = DBState.nodes[nodeID];

  return (
    <div>
      {node.history !== undefined && (
        <div>
          {" "}
          <NodeHistoryItem item={node} current />
          {Object.values(node.history).map((node, index) => (
            <NodeHistoryItem key={index} item={node} />
          ))}
        </div>
      )}
      <div className="mt-3">
        <AddNodeHistoryItem nodeID={nodeID} />
      </div>
    </div>
  );
}

function NodeHistoryItem({
  item,
  current,
}: {
  item: Types.HistoryNode | Types.Node;
  current?: boolean;
}) {
  const { editState, setEditState } = useContext(EditContext);
  return (
    <div
      className="group pointer-events-auto mt-3 flex cursor-pointer items-center justify-between rounded-lg p-3 shadow-lg transition-transform first:mt-0 hover:translate-x-2"
      onClick={() =>
        setEditState({
          ...editState,
          nodeHistory: !current ? item.id : undefined,
        })
      }
    >
      <div className="font-bold">{item.location.name}</div>
      {item.date !== undefined && (
        <div>
          {new Date(item.date).toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </div>
      )}
    </div>
  );
}

function AddNodeHistoryItem({ nodeID }: { nodeID: number }) {
  const { DBState } = useContext(DBContext);
  const [date, setDate] = useState<Date | undefined>();
  const [locationstring, setLocationstring] = useState<string | undefined>(
    undefined,
  );
  const locationRef = useRef<HTMLInputElement>(null);
  const node = DBState.nodes[nodeID];

  function onDateChange(changeDate: Date | undefined) {
    if (changeDate === undefined) return;
    setDate(changeDate);
  }
  async function submit() {
    if (locationstring === undefined || locationstring.length === 0)
      throw new Error("Location undefined");
    const location = await geoCode(locationstring);

    if (date !== undefined) {
      const newId = date.getTime();
      update(
        "nodes",
        {
          ...node,
          history: {
            ...node.history,
            [newId]: { ...node, date: newId, id: newId, location: location },
          },
        },
        "change",
        true,
      );
    } else {
      //Replace current & make previous to history event
      const currentDate = node.date === undefined ? Date.now() : node.date;

      update(
        "nodes",
        {
          ...node,
          location: location,
          date: currentDate,
          history: {
            ...node.history,
            [currentDate]: { ...node, date: currentDate },
          },
        },
        "change",
        true,
      );
    }

    setLocationstring(undefined);

    if (locationRef.current) {
      locationRef.current.value = "";
    }
  }
  return (
    <div>
      <DatePicker onDateChange={onDateChange} />
      <TextInput
        ref={locationRef}
        placeholder="Location"
        onBlur={(e) => setLocationstring(e.target.value)}
      />
      <div className="mt-3">
        {" "}
        <Button
          label="Add Snapshot"
          icon={<LucideHistory />}
          type="confirm"
          onClick={submit}
        />
      </div>
    </div>
  );
}
