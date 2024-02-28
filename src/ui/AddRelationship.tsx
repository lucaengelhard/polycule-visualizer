import { useContext, useEffect, useRef, useState } from "react";
import { DBContext } from "../App";
import { Button, RadioInput, TextInput } from "./Components";
import { Link, Users, XCircle } from "lucide-react";
import * as Types from "../types/types";
import { update } from "../db/db";

export default function AddRelationship() {
  const { DBState } = useContext(DBContext);
  const [open, setOpen] = useState(true);
  const [linkTypes, setLinkTypes] = useState<Types.RadioItems>({ items: {} });
  const [partner1, setPartner1] = useState<Types.Node | undefined>(undefined);
  const [partner2, setPartner2] = useState<Types.Node | undefined>(undefined);

  useEffect(() => {
    const radioItemList: Types.RadioItemList = {};

    for (const key in DBState.linkTypes) {
      if (Object.prototype.hasOwnProperty.call(DBState.linkTypes, key)) {
        const linkType = DBState.linkTypes[key];

        radioItemList[linkType.id].id = linkType.id;
        radioItemList[linkType.id].name = linkType.name;
        radioItemList[linkType.id].color = linkType.color;
      }
    }

    setLinkTypes({
      items: { ...radioItemList },
    });
  }, [DBState.linkTypes]);

  function submit() {
    console.log(partner1);
    console.log(partner2);
    console.log(linkTypes.selected);
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
