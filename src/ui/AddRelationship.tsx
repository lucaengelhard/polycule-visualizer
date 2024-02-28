import { useContext, useEffect, useRef, useState } from "react";
import { DBContext } from "../App";
import { Button, RadioInput, TextInput } from "./Components";
import { Link, Users, XCircle } from "lucide-react";
import * as Types from "../types/types";
import Classes from "../classes";
import { update } from "../db/db";
import { getNewIndex } from "../utils/helpers";

export default function AddRelationship() {
  const { DBState } = useContext(DBContext);
  const [open, setOpen] = useState(false);
  const [linkTypes, setLinkTypes] = useState<Types.RadioItems>({ items: {} });
  const [prevLinkItemIds, setPrevLinkItemIds] = useState<string[]>([]);
  const [partner1, setPartner1] = useState<Types.Node | undefined>(undefined);
  const [partner2, setPartner2] = useState<Types.Node | undefined>(undefined);

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
      items: { ...radioItemList },
    });
  }, [DBState.linkTypes]);

  useEffect(() => {
    const difference = Object.keys(linkTypes.items).filter(
      (x) => !prevLinkItemIds.includes(x),
    );

    setPrevLinkItemIds(Object.keys(linkTypes.items));

    const index = parseInt(difference[0]);

    if (linkTypes.items[index]) {
      const newLinkType: Types.LinkType = {
        name: linkTypes.items[index].name,
        color: linkTypes.items[index].color ?? "#ffffff",
        id:
          Object.keys(DBState.linkTypes).length === 0 &&
          !(index in DBState.linkTypes)
            ? index
            : getNewIndex(DBState.linkTypes),
      };

      update("linkTypes", newLinkType, "add");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkTypes.items]);

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

            update("linkTypes", newLinkType, "change");
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkTypes.items]);

  function submit() {
    if (partner1 === undefined) throw new Error("Partner 1 undefined");
    if (partner2 === undefined) throw new Error("Partner 2 undefined");
    if (linkTypes.selected === undefined) throw new Error("LinkType undefined");

    const linkType: Types.LinkType = DBState.linkTypes[linkTypes.selected?.id];

    const rel = new Classes.Link(
      { partner1: partner1, partner2: partner2 },
      linkType,
    );

    update("links", rel, "add");
  }

  return (
    <div>
      {!open && (
        <Button
          label="Add Person"
          icon={<Users />}
          onClick={() => setOpen(true)}
        />
      )}

      {open && (
        <div className="grid gap-3 rounded-lg bg-white p-3 shadow-lg">
          <div className="flex gap-3">
            <SearchField setResult={setPartner1} />
            <SearchField setResult={setPartner2} />
          </div>

          <RadioInput
            items={linkTypes}
            setItems={setLinkTypes}
            extendable={true}
            color={true}
            visibleElements={5}
          />
          <Button
            label="Add Relationship"
            icon={<Link />}
            type="confirm"
            onClick={submit}
          />
          <Button
            label="Close"
            icon={<XCircle />}
            type="deny"
            onClick={() => {
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function SearchField({
  setResult,
}: {
  setResult: React.Dispatch<React.SetStateAction<Types.Node | undefined>>;
}) {
  const { DBState } = useContext(DBContext);
  const [searching, setSearching] = useState(true);
  const [suggestions, setSuggestions] = useState<Types.Node[]>([]);

  const textRef = useRef<HTMLInputElement>(null);

  function search(event: React.ChangeEvent<HTMLInputElement>) {
    setSearching(true);
    const query = event.target.value.toLowerCase();

    if (query.length === 0) {
      setSuggestions([]);
    }

    const res = Object.values(DBState.nodes).filter((node) => {
      return node.name.toLowerCase().includes(query);
    });

    setSuggestions(res);
  }

  function textBlur() {
    if (textRef.current && suggestions[0].name !== undefined) {
      if (textRef.current.value.length === 0) {
        setSuggestions([]);
        return;
      }
      if (textRef.current.value === suggestions[0].name) {
        setResult(suggestions[0]);
        setSuggestions([]);
      }
    }
  }

  return (
    <div className="relative">
      <TextInput
        ref={textRef}
        placeholder="Partner Name"
        onChange={search}
        onBlur={textBlur}
      />
      {searching && (
        <ul
          className="absolute left-0 top-14 w-full rounded-lg bg-white
        shadow-lg"
        >
          {" "}
          {suggestions.map((suggestion, index) => {
            return (
              <SearchListItem
                setResult={setResult}
                setSuggestions={setSuggestions}
                suggestion={suggestion}
                key={index}
                textRef={textRef}
              />
            );
          })}{" "}
        </ul>
      )}
    </div>
  );
}

function SearchListItem({
  setSuggestions,
  setResult,
  suggestion,
  textRef,
}: {
  setSuggestions: React.Dispatch<React.SetStateAction<Types.Node[]>>;
  setResult: React.Dispatch<React.SetStateAction<Types.Node | undefined>>;
  suggestion: Types.Node;
  textRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <li className="cursor-pointer rounded-lg p-3 outline-offset-0 outline-blue-500 hover:outline">
      <button
        className="w-full text-left"
        onClick={() => {
          setResult(suggestion);
          setSuggestions([]);
          if (textRef.current) textRef.current.value = suggestion.name;
        }}
      >
        <div className="font-bold text-blue-500">{suggestion.name}</div>
        <div className="text-blue-500/50">{suggestion.location.name}</div>
      </button>
    </li>
  );
}
