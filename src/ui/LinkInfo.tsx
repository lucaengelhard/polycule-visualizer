import { useContext, useEffect, useState } from "react";
import { DBContext, EditContext } from "../App";
import {
  CornerDownLeft,
  CornerUpLeft,
  Link,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";

import * as Types from "../types";
import { remove, update } from "../db";
import ClassLink from "../classes/link";
import { Button, RadioInput, WindowTitle } from "./components";
import useConfirm from "./components/ConfirmDialog";

export default function LinkInfo() {
  const { editState, setEditState } = useContext(EditContext);
  const { DBState } = useContext(DBContext);

  const [link, setLink] = useState<ClassLink | undefined>(undefined);
  const [linkTypes, setLinkTypes] = useState<Types.RadioItems>({ items: {} });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (editState.link !== undefined) {
      setLink(DBState.links[editState.link]);
    } else {
      setLink(undefined);
    }
  }, [DBState.links, editState.link, DBState]);

  //Update Linktypes
  useEffect(() => {
    const radioItemList: Types.RadioItemList = {};

    for (const key in DBState.linkTypes) {
      if (Object.prototype.hasOwnProperty.call(DBState.linkTypes, key)) {
        const linkType = DBState.linkTypes[key];

        const newRadioItem: Types.RadioItem = {
          id: linkType.id,
          name: linkType.name,
          color: linkType.color,
        };

        radioItemList[linkType.id] = newRadioItem;
      }
    }

    setLinkTypes({
      selected: link !== undefined ? link.type : undefined,
      items: { ...radioItemList },
    });
  }, [DBState.linkTypes, link]);

  //Update Link on selected Change
  useEffect(() => {
    if (
      linkTypes.selected !== undefined &&
      (link?.type.id !== linkTypes.selected.id ||
        link?.type.name !== linkTypes.selected.name) &&
      link !== undefined
    ) {
      setLink({
        ...link,
        type: {
          id: linkTypes.items[linkTypes.selected.id].id,
          name: linkTypes.items[linkTypes.selected.id].name,
          color:
            linkTypes.items[linkTypes.selected.id].color !== undefined
              ? (linkTypes.items[linkTypes.selected.id].color as string)
              : "#ffffff",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkTypes.selected]);

  //Update DB on internal Link change
  useEffect(() => {
    if (link !== undefined && DBState.links[link.id] !== undefined) {
      // Update on type change
      if (link?.type.id !== DBState.links[link.id].type.id) {
        update("links", link, "change", true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link]);

  //Update Linktypes when type is added
  useEffect(() => {
    if (Object.keys(linkTypes.items).length > 0) {
      const changed: Types.RadioItem[] = [];
      const added: Types.RadioItem[] = [];
      Object.values(linkTypes.items).forEach((item) => {
        //Check if Item already exists -> If not create it
        if (DBState.linkTypes[item.id] === undefined) {
          added.push(item);
          return;
        }

        changed.push(item);
      });

      added.forEach((item, index) =>
        update("linkTypes", item, "add", index === added.length - 1),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkTypes.items]);

  //Update Linktype properties on change
  useEffect(() => {
    for (const key in linkTypes.items) {
      if (Object.prototype.hasOwnProperty.call(linkTypes.items, key)) {
        const element = linkTypes.items[key];
        const index = parseInt(key);

        if (DBState.linkTypes[key] !== undefined) {
          if (
            DBState.linkTypes[key].color !== element.color ||
            DBState.linkTypes[key].name !== element.name
          ) {
            const newLinkType: Types.LinkType = {
              name: linkTypes.items[key].name,
              color: linkTypes.items[key].color ?? "#ffffff",
              id: index,
            };

            update("linkTypes", newLinkType, "change", true);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkTypes.items]);

  const confirm = useConfirm();
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

  return (
    <>
      {link !== undefined && (
        <div className="grid h-min gap-3 rounded-lg bg-white p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="grid gap-3">
              <Button
                label={link.source.name}
                icon={<UserRound />}
                onClick={() =>
                  setEditState({ ...editState, node: link.source.id })
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
            </div>
            <div className="grid h-min gap-3">
              <CornerUpLeft />
              <CornerDownLeft />
            </div>
          </div>
          <RadioInput
            items={linkTypes}
            setItems={setLinkTypes}
            extendable={true}
            color={true}
            visibleElements={5}
            deletable={false}
          />

          <div className="flex justify-between">
            <Button type="deny" icon={<Trash2 />} onClick={deleteLink} />
          </div>
        </div>
      )}
    </>
  );
}
