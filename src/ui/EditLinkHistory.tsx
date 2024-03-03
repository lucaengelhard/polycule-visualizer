import { useContext, useState } from "react";
import { DBContext, EditContext } from "../App";
import { hexToRGBA } from "../utils/helpers";

import ClassLink from "../classes/link";
import { Types } from "../types";
import { Button, RadioInput } from "./components";

import { remove, update } from "../db/db";
import { DatePicker } from "./components/Datepicker";
import { History as LucideHistory } from "lucide-react";

export function EditLinkHistory({ linkID }: { linkID: number }) {
  const { DBState } = useContext(DBContext);

  const link = DBState.links[linkID];

  return (
    <div className="rounded-lg bg-white p-3 shadow-lg">
      {link.history !== undefined && (
        <div>
          <LinkHistoryItem item={link} current={true} />
          {Object.values(link.history).map((item, index) => (
            <LinkHistoryItem key={index} item={item} />
          ))}
        </div>
      )}
      <div className="mt-3">
        <AddLinkHistoryItem linkID={linkID} />
      </div>
    </div>
  );
}

function LinkHistoryItem({
  item,
  current,
}: {
  item: Types.HistoryLink | ClassLink;
  current?: boolean;
}) {
  const { editState, setEditState } = useContext(EditContext);
  const divStyle = {
    backgroundColor: hexToRGBA(item.type.color, 0.5) ?? "#ffffff",
  };

  return (
    <div
      style={divStyle}
      onClick={() =>
        setEditState({
          ...editState,
          linkHistory: !current ? item.id : undefined,
        })
      }
      className="group pointer-events-auto mt-3 flex cursor-pointer items-center justify-between rounded-lg p-3 shadow-lg transition-transform first:mt-0 hover:translate-x-2"
    >
      {!current &&
        Object.prototype.hasOwnProperty.call(item, "date") &&
        new Date((item as Types.HistoryLink).date).toLocaleDateString(
          undefined,
          {
            dateStyle: "medium",
          },
        )}
      {current && "Current State"}
    </div>
  );
}

function AddLinkHistoryItem({ linkID }: { linkID: number }) {
  const { DBState } = useContext(DBContext);
  const [selected, setSelected] = useState<Types.LinkType | undefined>(
    undefined,
  );

  const link = DBState.links[linkID];
  const [date, setDate] = useState<Date | undefined>();

  function onSelectedChange(selectedItem: Types.RadioItem | undefined) {
    if (selectedItem !== undefined) {
      setSelected(DBState.linkTypes[selectedItem?.id]);
      return;
    }
    setSelected(undefined);
  }

  function onItemChanged(changedItem: Types.RadioItem) {
    update(
      "linkTypes",
      { color: changedItem.color, id: changedItem.id, name: changedItem.name },
      "change",
      true,
    );
  }

  function onItemAdded(addedItem: Types.RadioItem) {
    update(
      "linkTypes",
      { color: addedItem.color, id: addedItem.id, name: addedItem.name },
      "add",
      true,
    );
  }

  function onItemDeleted(deltedItem: Types.RadioItem) {
    remove(DBState.linkTypes[deltedItem.id], true);
  }

  function onDateChange(date: Date | undefined) {
    if (date === undefined) return;
    setDate(date);
  }

  function submit() {
    if (selected === undefined) return;

    if (date !== undefined) {
      const newId = date.getTime();

      update(
        "links",
        {
          ...link,
          history: {
            ...link?.history,
            [newId]: {
              ...link,
              date: newId,
              id: newId,
              type: DBState.linkTypes[selected.id],
            },
          },
        },
        "change",
        true,
      );
      return;
    }

    //Replace current & make previous to history event
    const currentDate = Date.now();

    update(
      "links",
      {
        ...link,
        type: DBState.linkTypes[selected.id],
        date: currentDate,
        history: {
          ...link?.history,
          [link.date === undefined ? currentDate : link.date]: {
            ...link,
            date: currentDate,
            id: currentDate,
          },
        },
      },
      "change",
      true,
    );
  }

  return (
    <div>
      <DatePicker onDateChange={onDateChange} />
      <RadioInput
        items={DBState.linkTypes}
        colorMode={true}
        extendable={true}
        onSelectedChange={onSelectedChange}
        onItemChanged={onItemChanged}
        onItemAdded={onItemAdded}
        onItemDeleted={onItemDeleted}
        selected={selected}
        addPlaceholder="Add Relationship Type"
      />
      <div className="mt-2">
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
