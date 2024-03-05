import { useContext } from "react";
import { DBContext, EditContext } from "../App";
import {
  CornerDownLeft,
  CornerUpLeft,
  Trash2,
  UserRound,
  History,
} from "lucide-react";

import { Types } from "../types";
import ClassLink from "../classes/link";
import { Button, RadioInput } from "./components";
import useConfirm from "./components/ConfirmDialog";
import { remove, update } from "../db/db";
import { HistoryLink } from "../types/types-old";

export default function LinkInfo() {
  const { DBState } = useContext(DBContext);
  const { editState, setEditState } = useContext(EditContext);

  const confirm = useConfirm();

  let link: ClassLink | undefined = undefined;
  let historyLink: HistoryLink | undefined = undefined;
  let isHistory = false;

  if (
    editState.link !== undefined &&
    DBState.links[editState.link] !== undefined
  ) {
    link = DBState.links[editState.link];
  }

  if (
    link !== undefined &&
    link.history !== undefined &&
    editState.linkHistory !== undefined &&
    link.history[editState.linkHistory] !== undefined
  ) {
    isHistory = true;
    historyLink = link.history[editState.linkHistory];
  }

  async function deleteLink() {
    const choice = await confirm({
      title: `Delete Relationship`,
      description: `Are you sure you want to delete the Relationship between ${link?.source.name} and ${link?.target.name}?`,
      confirmBtnLabel: "Yes",
    });

    if (choice && link !== undefined) {
      remove(link, true);
      setEditState({ ...editState, link: undefined, linkHistory: undefined });
    }
  }

  function onSelectedChange(selectedItem: Types.RadioItem | undefined) {
    if (selectedItem !== undefined) {
      if (
        isHistory &&
        historyLink !== undefined &&
        link?.history !== undefined
      ) {
        update(
          "links",
          {
            ...link,
            history: {
              ...link?.history,
              [historyLink.id]: {
                ...link?.history[historyLink.id],
                type: DBState.linkTypes[selectedItem.id],
              },
            },
          },
          "change",
          true,
        );
        return;
      }
      update(
        "links",
        { ...link, type: DBState.linkTypes[selectedItem.id] },
        "change",
        true,
      );
    }
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

  return (
    <>
      {link && (
        <div className="grid h-min gap-3 rounded-lg bg-white p-3 shadow-lg">
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-3">
              <div className="grid gap-3">
                <Button
                  label={link.source.name}
                  icon={<UserRound />}
                  onClick={() =>
                    setEditState({
                      ...editState,
                      node: link ? link.source.id : undefined,
                    })
                  }
                  additionalClasses="transition-transform
                hover:translate-x-2"
                />
                <Button
                  label={link.target.name}
                  icon={<UserRound />}
                  onClick={() =>
                    setEditState({
                      ...editState,
                      node: link ? link.target.id : undefined,
                    })
                  }
                  additionalClasses="transition-transform
                hover:translate-x-2"
                />
              </div>{" "}
              <div className="grid h-min gap-3">
                <CornerUpLeft />
                <CornerDownLeft />
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                {isHistory && historyLink !== undefined && (
                  <div className="rounded-lg bg-white p-3 shadow-lg">
                    {new Date(historyLink.date).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </div>
                )}
                <Button
                  icon={<History />}
                  onClick={() =>
                    setEditState({ ...editState, linkHistoryOpen: true })
                  }
                />
                <Button type="deny" icon={<Trash2 />} onClick={deleteLink} />
              </div>
            </div>
          </div>
          <div>
            <RadioInput
              items={DBState.linkTypes}
              deletable={true}
              colorMode={true}
              extendable={true}
              onSelectedChange={onSelectedChange}
              onItemChanged={onItemChanged}
              onItemAdded={onItemAdded}
              onItemDeleted={onItemDeleted}
              selected={
                isHistory && historyLink !== undefined
                  ? historyLink.type
                  : link
                    ? link.type
                    : undefined
              }
              addPlaceholder="Add Relationship Type"
            />
          </div>
        </div>
      )}
    </>
  );
}
