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
import { Button, RadioInput, WindowTitle } from "./Components";
import * as Types from "../types/types";
import { remove, update } from "../db/db";
import ClassLink from "../classes/link";

export default function LinkInfo() {
  const { editState, setEditState } = useContext(EditContext);
  const { DBState } = useContext(DBContext);
  const [link, setLink] = useState<ClassLink | undefined>(undefined);
  const [partner1name, setPartner1name] = useState<string | undefined>(
    undefined,
  );

  const [linkTypes, setLinkTypes] = useState<Types.RadioItems>({
    items: {},
  });
  const [prevLinkTypes, setPrevLinkTypes] = useState<Types.RadioItemList>({});

  useEffect(() => {
    if (
      editState.link !== undefined &&
      DBState.links[editState.link] !== undefined
    ) {
      setLink(DBState.links[editState.link]);

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
        items: { ...radioItemList },
        selected: {
          name: DBState.links[editState.link].type.name,
          id: DBState.links[editState.link].type.id,
          color: DBState.links[editState.link].type.color,
        },
      });
    } else {
      setLink(undefined);
      setLinkTypes({ items: {}, selected: undefined });
    }
  }, [editState.link, DBState.links, DBState.linkTypes]);

  //Update DB on TypeList change
  useEffect(() => {
    const difference = Object.keys(linkTypes.items).filter(
      (key) => !Object.keys(prevLinkTypes).includes(key),
    );

    if (difference.length > 0) {
      difference.forEach((idString) => {
        const id = parseInt(idString);
        const newLinkType: Types.LinkType = {
          name: linkTypes.items[id].name,
          color: linkTypes.items[id].color ?? "#ffffff",
          id: id,
        };

        update("linkTypes", newLinkType, "change", true);
      });
    } else {
      Object.keys(linkTypes.items).forEach((idString) => {
        const id = parseInt(idString);

        if (
          linkTypes.items[id].color !== DBState.linkTypes[id].color ||
          linkTypes.items[id].name !== DBState.linkTypes[id].name
        ) {
          const newLinkType: Types.LinkType = {
            name: linkTypes.items[id].name,
            color: linkTypes.items[id].color ?? "#ffffff",
            id: id,
          };

          update("linkTypes", newLinkType, "change", true);
        }
      });
    }
    setPrevLinkTypes(linkTypes.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkTypes.items]);

  useEffect(() => {
    if (
      editState.link !== undefined &&
      DBState.links[editState.link] !== undefined
    ) {
      setLink(DBState.links[editState.link]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DBState]);

  function deleteLink() {
    if (link !== undefined) {
      remove(link, true);
      setEditState({ ...editState, link: undefined });
    }
  }

  return (
    <>
      {link !== undefined && (
        <div className="grid h-min gap-3 rounded-lg bg-white p-3 shadow-lg">
          <WindowTitle label="Relationship:" icon={<Link />} />
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
            <Button
              label="Close"
              icon={<XCircle />}
              type="deny"
              onClick={() => {
                setEditState({ ...editState, link: undefined });
              }}
            />
            <Button type="deny" icon={<Trash2 />} onClick={deleteLink} />
          </div>
        </div>
      )}
    </>
  );
}
