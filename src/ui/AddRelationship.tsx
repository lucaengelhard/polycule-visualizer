import { useContext, useRef, useState } from "react";
import { DBContext } from "../App";

import { Link } from "lucide-react";
import { Types } from "../types";

import { remove, update } from "../db";
import ClassLink from "../classes/link";
import { Button, TextInput } from "./components";
import RadioInput from "./components/RadioInput";

export default function AddRelationship() {
  const { DBState } = useContext(DBContext);
  const [partner1, setPartner1] = useState<Types.Node | undefined>(undefined);
  const [partner2, setPartner2] = useState<Types.Node | undefined>(undefined);
  const [selected, setSelected] = useState<Types.LinkType | undefined>(
    undefined,
  );

  function submit() {
    if (partner1 === undefined) throw new Error("Partner 1 undefined");
    if (partner2 === undefined) throw new Error("Partner 2 undefined");
    if (selected === undefined) throw new Error("LinkType undefined");

    const link = new ClassLink(
      { partner1: partner1, partner2: partner2 },
      DBState.linkTypes[selected.id],
    );

    update("links", link, "add", true);
  }

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

  return (
    <div className="grid gap-3 rounded-lg bg-white p-3 shadow-lg">
      <div className="flex gap-3">
        <SearchField setResult={setPartner1} />
        <SearchField setResult={setPartner2} />
      </div>
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
          return;
        }
        setSuggestions([]);
        textRef.current.value = "";
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
