import { CheckCircle, Circle, PlusCircle, Users } from "lucide-react";
import { createContext, useContext, useRef, useState } from "react";
import { hexToRGBA } from "../utils/helpers";

import { add, db } from "../db/db";
import { Relationship } from "../classes/relationship-old";
import { InputOpenContext } from "./UI";

const AddRelContext = createContext<{
  addRelState: Types.addRelState;
  setAddRelState: React.Dispatch<React.SetStateAction<Types.addRelState>>;
}>(null);

export function AddRelationship() {
  const { setAddRelOpen } = useContext(InputOpenContext);
  const [addRelState, setAddRelState] = useState<Types.addRelState>({
    queriedPartners: { 0: [], 1: [] },
    selectedPartners: { 0: undefined, 1: undefined },
    relTypes: { items: [], selected: undefined },
  });

  function addRel() {
    if (
      addRelState.selectedPartners[0] === undefined ||
      addRelState.selectedPartners[1] === undefined
    ) {
      throw new Error("Partner undefined");
    }

    if (
      addRelState.selectedPartners[0].id === addRelState.selectedPartners[1].id
    ) {
      throw new Error("Partners are the Same");
    }

    if (addRelState.relTypes.selected === undefined) {
      throw new Error("Relationship Type undefined");
    }

    const rel = new Relationship(
      {
        partner1: addRelState.selectedPartners[0],
        partner2: addRelState.selectedPartners[1],
      },
      addRelState.relTypes.selected,
      false,
    );

    const length = add({ payload: rel, type: "link" });
    if (length !== undefined) {
      const index = length - 1;
      console.log(db.links[index]);
    } else {
      throw new Error("Adding to DB Failed");
    }
  }

  return (
    <AddRelContext.Provider value={{ addRelState, setAddRelState }}>
      <fieldset className="absolute left-3 top-3 m-0 inline-block rounded-lg bg-white p-3 shadow-lg">
        <div className="flex gap-3">
          <InputRelPerson index={0} />
          <InputRelPerson index={1} />
        </div>
        <SelectRelType />
        <div className="flex gap-3">
          <button
            onClick={addRel}
            className="mt-3 flex gap-3 rounded-lg p-3 shadow-lg transition-colors hover:bg-green-500"
          >
            <PlusCircle />
            Submit
          </button>
          <button
            onClick={() => setAddRelOpen(false)}
            className="mt-3 flex gap-3 rounded-lg p-3 shadow-lg transition-colors hover:bg-red-500"
          >
            Cancel
          </button>
        </div>
      </fieldset>
    </AddRelContext.Provider>
  );
}

function InputRelPerson({ index }: { index: 0 | 1 }) {
  const { addRelState, setAddRelState } = useContext(AddRelContext);
  const inputField = useRef<HTMLInputElement>(null);

  function searchRelPerson(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value.toLowerCase();

    if (query.length === 0) {
      setAddRelState({
        ...addRelState,
        queriedPartners: {
          ...addRelState.queriedPartners,
          [index]: [],
        },
      });
      return;
    }

    const res = db.nodes.filter((node) =>
      node.name.toLowerCase().includes(query),
    );

    setAddRelState({
      ...addRelState,
      queriedPartners: {
        ...addRelState.queriedPartners,
        [index]: res,
      },
    });
  }

  function updateInputFieldText(string: string) {
    if (inputField.current) {
      inputField.current.value = string;
    }
  }

  return (
    <div>
      <input
        ref={inputField}
        onChange={searchRelPerson}
        type="text"
        name="partner"
        className="mt-2 block rounded-lg p-3 shadow-lg"
        placeholder="Partner Name"
      />
      {addRelState.queriedPartners[index] &&
        addRelState.queriedPartners[index].length > 0 && (
          <InputRelPersonList
            index={index}
            queriedPartners={addRelState.queriedPartners[index]}
            updateInputFieldText={updateInputFieldText}
          />
        )}
    </div>
  );
}

function InputRelPersonList({
  index,
  queriedPartners,
  updateInputFieldText,
}: {
  index: 0 | 1;
  queriedPartners: Types.Person[];
  updateInputFieldText: (string: string) => void;
}) {
  return (
    <ul className="mt-3 rounded-lg bg-white shadow-lg">
      {queriedPartners.map((person, i) => (
        <InputRelPersonListItem
          key={i}
          person={person}
          index={index}
          updateInputFieldText={updateInputFieldText}
        />
      ))}
    </ul>
  );
}

function InputRelPersonListItem({
  person,
  index,
  updateInputFieldText,
}: {
  person: Types.Person;
  index: 0 | 1;
  updateInputFieldText: (string: string) => void;
}) {
  const { addRelState, setAddRelState } = useContext(AddRelContext);

  function setPartner() {
    setAddRelState({
      ...addRelState,
      selectedPartners: { ...addRelState.selectedPartners, [index]: person },
      queriedPartners: {
        ...addRelState.queriedPartners,
        [index]: [],
      },
    });

    updateInputFieldText(person.name);
  }
  return (
    <li className="cursor-pointer rounded-lg p-3 outline-offset-0 outline-blue-500 hover:outline">
      <button className="w-full text-left" onClick={setPartner}>
        <div className="font-bold text-blue-500">{person.name}</div>
        <div className="text-blue-500/50">{person.location.name}</div>
      </button>
    </li>
  );
}

function SelectRelType() {
  const { addRelState, setAddRelState } = useContext(AddRelContext);

  function updateChecked(id: number) {
    const items = addRelState.relTypes.items;
    let selected = addRelState.relTypes.selected;
    addRelState.relTypes.items.forEach((item, index) => {
      if (item.id === id) {
        if (item.checked) {
          item.checked = false;
          selected = undefined;
        } else {
          item.checked = true;
          selected = item;
        }
      } else {
        item.checked = false;
      }

      items[index] = item;
    });

    setAddRelState({
      ...addRelState,
      relTypes: {
        ...addRelState.relTypes,
        items: items,
        selected: selected,
      },
    });
  }

  return (
    <fieldset className="mt-3">
      <legend>Select the type of Relationship</legend>
      {addRelState.relTypes.items.map((item, index) => (
        <RelType
          key={item.id}
          index={index}
          isChecked={item.checked ?? false}
          relType={item}
          updateChecked={() => updateChecked(item.id)}
        />
      ))}
      <AddRelType />
    </fieldset>
  );
}

function RelType({
  index,
  isChecked,
  updateChecked,
}: {
  relType: Types.RelType;
  index: number;
  isChecked: boolean;
  updateChecked: () => void;
}) {
  const { addRelState, setAddRelState } = useContext(AddRelContext);

  const divStyle = {
    backgroundColor:
      hexToRGBA(addRelState.relTypes.items[index].color, 0.5) ?? "#ffffff",
  };

  function changeColor(event: React.ChangeEvent<HTMLInputElement>) {
    const items = addRelState.relTypes.items;
    items[index].color = event.target.value;

    setAddRelState({
      ...addRelState,
      relTypes: {
        ...addRelState.relTypes,
        items: items,
      },
    });
  }

  function changeName(event: React.ChangeEvent<HTMLInputElement>) {
    const items = addRelState.relTypes.items;
    items[index].name = event.target.value;

    setAddRelState({
      ...addRelState,
      relTypes: {
        ...addRelState.relTypes,
        items: items,
      },
    });
  }

  return (
    <div
      className="mt-1 flex h-10 justify-between gap-3 rounded-lg pl-3 pr-1"
      style={divStyle}
    >
      <div className="flex w-full items-center gap-3">
        <button className="cursor-pointer" onClick={updateChecked}>
          {isChecked ? <CheckCircle /> : <Circle />}
        </button>
        <label
          className="block w-full cursor-pointer"
          htmlFor={addRelState.relTypes.items[index].name}
        >
          <input
            onBlur={changeName}
            type="text"
            defaultValue={addRelState.relTypes.items[index].name}
            className="cursor-pointer bg-transparent"
          />
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          className=" h-8 w-8 rounded-lg"
          type="color"
          name="relTypeColor"
          value={addRelState.relTypes.items[index].color}
          onChange={changeColor}
        />
      </div>
    </div>
  );
}

function AddRelType() {
  const { addRelState, setAddRelState } = useContext(AddRelContext);
  const relName = useRef<HTMLInputElement>(null);
  const relColor = useRef<HTMLInputElement>(null);

  function addRelType() {
    if (relName.current && relColor.current) {
      const type = {
        id: addRelState.relTypes.items.length,
        name: relName.current.value,
        color: relColor.current.value,
        checked: false,
      };

      setAddRelState({
        ...addRelState,
        relTypes: {
          ...addRelState.relTypes,
          items: [...addRelState.relTypes.items, type],
        },
      });

      console.log(add({ type: "relType", payload: type }));
      relName.current.value = "";
    }
  }

  return (
    <div className="flex gap-3">
      <input
        ref={relName}
        type="text"
        name="addType"
        placeholder="New Relationship type"
        className="mt-2 block rounded-lg p-3 shadow-lg"
      />
      <input
        ref={relColor}
        className="mt-4 h-10 w-10 rounded-lg"
        type="color"
        name="relColor"
      />
      <button
        onClick={addRelType}
        className="mt-3 flex gap-3 rounded-lg p-3 shadow-lg transition-colors hover:bg-green-500"
      >
        <PlusCircle />
      </button>
    </div>
  );
}

export function AddRelationshipButton() {
  const { setAddPersonOpen, setAddRelOpen } = useContext(InputOpenContext);
  return (
    <button
      onClick={() => {
        setAddPersonOpen(false);
        setAddRelOpen(true);
      }}
      className="flex gap-3 rounded-lg bg-white p-3 shadow-xl outline-offset-0 outline-blue-500 hover:outline"
    >
      <Users /> Add Relationship
    </button>
  );
}
