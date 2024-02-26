import { CheckCircle, Circle, PlusCircle, Users } from "lucide-react";
import {
  MouseEventHandler,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { hexToRGBA } from "../utils/helpers";
import * as Types from "../types/types";
import { db } from "../db/db";
import { Relationship } from "../classes/relationship";
import { InputOpenContext } from "./Input";

const AddRelContext = createContext<{
  addRelState: {
    queriedPartners: Map<0 | 1, Types.Person[] | undefined>;
    relTypes: { items: Types.RelType[]; selected?: Types.RelType | undefined };
  };
  setAddRelState: React.Dispatch<
    React.SetStateAction<{
      queriedPartners: Map<0 | 1, Types.Person[] | undefined>;
      relTypes: {
        items: Types.RelType[];
        selected?: Types.RelType;
      };
    }>
  >;
}>(null);

export function AddRelationship() {
  const { setAddRelOpen } = useContext(InputOpenContext);
  const [addRelState, setAddRelState] = useState<{
    queriedPartners: Map<0 | 1, Types.Person[] | undefined>;
    relTypes: {
      items: Types.RelType[];

      selected?: Types.RelType;
    };
  }>({
    queriedPartners: new Map([
      [0, undefined],
      [1, undefined],
    ]),
    relTypes: { items: [], selected: undefined },
  });

  function addRel() {
    const partner1List = addRelState.queriedPartners.get(0);
    const partner2List = addRelState.queriedPartners.get(1);

    if (partner1List === undefined || partner2List === undefined) {
      throw new Error("Partner undefined");
    }

    if (addRelState.relTypes.selected === undefined) {
      throw new Error("Relationship Type undefined");
    }

    const partner1 = partner1List[0];
    const partner2 = partner2List[0];

    const rel = new Relationship(
      {
        partner1: partner1,
        partner2: partner2,
      },
      addRelState.relTypes.selected,
      false
    );

    console.log(rel);
  }

  return (
    <AddRelContext.Provider value={{ addRelState, setAddRelState }}>
      <fieldset className="m-0 p-3 shadow-lg rounded-lg inline-block absolute top-3 left-3 bg-white">
        <div className="flex gap-3">
          <InputRelPerson index={0} />
          <InputRelPerson index={1} />
        </div>
        <SelectRelType />
        <div className="flex gap-3">
          <button
            onClick={addRel}
            className="flex gap-3 mt-3 p-3 rounded-lg shadow-lg hover:bg-green-500 transition-colors"
          >
            <PlusCircle />
            Submit
          </button>
          <button
            onClick={() => setAddRelOpen(false)}
            className="flex gap-3 mt-3 p-3 rounded-lg shadow-lg hover:bg-red-500 transition-colors"
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
  function searchRelPerson(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    if (query.length === 0) {
      addRelState.queriedPartners.set(index, undefined);
      setAddRelState({
        ...addRelState,
        queriedPartners: new Map([
          ...addRelState.queriedPartners,
          [index, undefined],
        ]),
      });
      return;
    }

    const res = db.nodes.filter((node) =>
      node.name.toLowerCase().includes(query)
    );

    setAddRelState({
      ...addRelState,
      queriedPartners: addRelState.queriedPartners.set(index, res),
    });
  }

  return (
    <input
      onChange={searchRelPerson}
      type="text"
      name="partner"
      className="p-3 mt-2 rounded-lg shadow-lg block"
      placeholder="Partner Name"
    />
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
      {addRelState.relTypes.items.map((item) => (
        <RelType
          key={item.id}
          isChecked={item.checked}
          relType={item}
          updateChecked={() => updateChecked(item.id)}
        />
      ))}
      <AddRelType />
    </fieldset>
  );
}

function RelType({
  relType,
  isChecked,
  updateChecked,
}: {
  relType: Types.RelType;
  isChecked: boolean;
  updateChecked: () => void;
}) {
  const [color, setColor] = useState(relType.color);
  const [name, setName] = useState(relType.name);

  const divStyle = {
    backgroundColor: hexToRGBA(color, 0.5) ?? "#ffffff",
  };

  function changeColor(event: React.ChangeEvent<HTMLInputElement>) {
    setColor(event.target.value);
    relType.color = event.target.value;
  }

  function changeName(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
    relType.name = event.target.value;
  }

  return (
    <div
      className="flex gap-3 pl-3 pr-1 mt-1 rounded-lg justify-between h-10"
      style={divStyle}
    >
      <div className="flex gap-3 w-full items-center">
        <button className="cursor-pointer" onClick={updateChecked}>
          {isChecked ? <CheckCircle /> : <Circle />}
        </button>
        <label className="cursor-pointer block w-full" htmlFor={name}>
          <input
            onBlur={changeName}
            type="text"
            defaultValue={name}
            className="bg-transparent cursor-pointer"
          />
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          className=" h-8 w-8 rounded-lg"
          type="color"
          name="relTypeColor"
          value={color}
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
        className="p-3 mt-2 rounded-lg shadow-lg block"
      />
      <input
        ref={relColor}
        className="h-10 mt-4 w-10 rounded-lg"
        type="color"
        name="relColor"
      />
      <button
        onClick={addRelType}
        className="flex gap-3 mt-3 p-3 rounded-lg shadow-lg hover:bg-green-500 transition-colors"
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
      className="flex gap-3 p-3 rounded-lg shadow-xl"
    >
      <Users /> Add Relationship
    </button>
  );
}
