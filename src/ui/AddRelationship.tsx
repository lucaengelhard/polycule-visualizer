import { useContext, useEffect, useRef, useState } from "react";
import { DBContext } from "../App";

import { Link } from "lucide-react";
import { Types } from "../types";

import { remove, update } from "../db";
import ClassLink from "../classes/link";
import { Button, TextInput } from "./components";
import RadioInput from "./components/RadioInput";

export default function AddRelationship() {
  const { DBState } = useContext(DBContext);

  function onSelectedChange(selectedItem: Types.RadioItem | undefined) {
    console.log(selectedItem);
  }

  function onItemChanged(changedItem: Types.RadioItem) {
    console.log(changedItem);
  }

  function onItemAdded(addedItem: Types.RadioItem) {
    console.log(addedItem);
  }

  function onItemDeleted(deltedItem: Types.RadioItem) {
    console.log(deltedItem);
  }

  return (
    <RadioInput
      inputItems={DBState.linkTypes}
      deletable={true}
      colorMode={true}
      extendable={true}
      onSelectedChange={onSelectedChange}
      onItemChanged={onItemChanged}
      onItemAdded={onItemAdded}
      onItemDeleted={onItemDeleted}
    />
  );
}

/*
export default function AddRelationship() {
  const { DBState } = useContext(DBContext);

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

    difference.forEach((key) => {
      const id = parseInt(key);

      if (linkTypes.items[id]) {
        const newLinkType: Types.LinkType = {
          name: linkTypes.items[id].name,
          color: linkTypes.items[id].color ?? "#ffffff",
          id: id,
        };

        update("linkTypes", newLinkType, "change", true);
      }
    });

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

            update("linkTypes", newLinkType, "change", true);
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

    const rel = new ClassLink(
      { partner1: partner1, partner2: partner2 },
      linkType,
    );

    update("links", rel, "add");
  }

  function deleteLinkType(id: number) {
    remove(DBState.linkTypes[id], true);
  }

  return (
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
        deletable={true}
        deleteID={deleteLinkType}
      />
      <Button
        label="Add Relationship"
        icon={<Link />}
        type="confirm"
        onClick={submit}
      />
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
    if (suggestions[0] !== undefined) {
      if (textRef.current && suggestions[0].name !== undefined) {
        if (textRef.current.value.length === 0) {
          setSuggestions([]);
          return;
        }
        if (
          textRef.current.value.toLowerCase() ===
          suggestions[0].name.toLowerCase()
        ) {
          textRef.current.value = suggestions[0].name;
          setResult(suggestions[0]);
          setSuggestions([]);
        }
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
    <li className="pointer-events-auto cursor-pointer rounded-lg p-3 outline-offset-0 outline-blue-500 hover:outline">
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
*/
