import { useContext, useMemo } from "react";
import { DBContext, EditContext } from "../App";
import { CornerDownLeft, CornerUpLeft, Trash2, UserRound } from "lucide-react";

import { Types } from "../types";
import { Button, RadioInput } from "./components";
import useConfirm from "./components/ConfirmDialog";
import { remove, update } from "../db/db";

export default function LinkInfo() {
  const { DBState } = useContext(DBContext);
  const { editState, setEditState } = useContext(EditContext);
  const confirm = useConfirm();

  const link = useMemo(() => {
    if (editState.link === undefined) return;
    return DBState.links[editState.link];
  }, [DBState.links, editState.link]);

  async function deleteLink() {
    const choice = await confirm({
      title: `Delete Relationship`,
      description: `Are you sure you want to delete the Relationship between ${link?.source.name} and ${link?.target.name}?`,
      confirmBtnLabel: "Yes",
    });

    if (choice && link !== undefined) {
      remove(link, true);
      setEditState({ ...editState, link: undefined });
    }
  }

  function onSelectedChange(selectedItem: Types.RadioItem | undefined) {
    if (selectedItem !== undefined) {
      update(
        "links",
        { ...link, type: DBState.linkTypes[selectedItem.id] },
        "change",
        true,
      );
      return;
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
                    setEditState({ ...editState, node: link.target.id })
                  }
                  additionalClasses="transition-transform
                hover:translate-x-2"
                />
                <Button
                  label={link.target.name}
                  icon={<UserRound />}
                  onClick={() =>
                    setEditState({ ...editState, node: link.target.id })
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
            <Button type="deny" icon={<Trash2 />} onClick={deleteLink} />
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
              selected={DBState.links[link.id].type}
              addPlaceholder="Add Relationship Type"
            />
          </div>
        </div>
      )}
    </>
  );
}
