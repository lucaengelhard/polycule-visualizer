import { PlusCircle, UserRoundPlus } from "lucide-react";
import { createContext, useContext, useRef, useState } from "react";
import * as Types from "../types/types";
import { add, db } from "../db/db";
import { geoCode } from "../utils/geocode";
import { InputOpenContext } from "./UI";

const AddPersonContext = createContext<{
  addPersonState: { name: string; locationString: string };
  setAddPersonState: React.Dispatch<
    React.SetStateAction<{ name: string; locationString: string }>
  >;
  nameInputField: React.RefObject<HTMLInputElement>;
  locationInputField: React.RefObject<HTMLInputElement>;
}>(null);

export function AddPerson() {
  const { setAddPersonOpen } = useContext(InputOpenContext);
  const [addPersonState, setAddPersonState] = useState({
    name: "",
    locationString: "",
  });

  const nameInputField = useRef<HTMLInputElement>(null);
  const locationInputField = useRef<HTMLInputElement>(null);

  async function addPerson() {
    if (addPersonState.name.length === 0) {
      throw new Error("Person name undefined");
    }

    if (addPersonState.name.length === 0) {
      throw new Error("location undefined");
    }

    const personLocation = await geoCode(addPersonState.locationString);

    const person: Types.Person = {
      id: db.nodes.length,
      name: addPersonState.name,
      location: personLocation,
      relationships: [],
    };

    const length = add({ payload: person, type: "node" });
    if (length !== undefined) {
      const index = length - 1;
      console.log(db.nodes[index]);
    } else {
      throw new Error("Adding to DB Failed");
    }

    if (nameInputField.current !== null) {
      nameInputField.current.value = "";
      addPersonState.name = "";
    }

    if (locationInputField.current !== null) {
      locationInputField.current.value = "";
      addPersonState.locationString = "";
    }
  }

  return (
    <AddPersonContext.Provider
      value={{
        addPersonState,
        setAddPersonState,
        nameInputField,
        locationInputField,
      }}
    >
      <fieldset className="absolute left-3 top-3 m-0 inline-block rounded-lg bg-white p-3 shadow-lg">
        <InputPersonName />
        <InputPersonLocation />
        <div className="flex gap-3">
          <button
            onClick={addPerson}
            className="mt-3 flex gap-3 rounded-lg p-3 shadow-lg transition-colors hover:bg-green-500"
          >
            <PlusCircle />
            Submit
          </button>
          <button
            onClick={() => setAddPersonOpen(false)}
            className="mt-3 flex gap-3 rounded-lg p-3 shadow-lg transition-colors hover:bg-red-500"
          >
            Cancel
          </button>
        </div>
      </fieldset>
    </AddPersonContext.Provider>
  );
}
function InputPersonName() {
  const { addPersonState, setAddPersonState, nameInputField } =
    useContext(AddPersonContext);

  function changeName(event: React.ChangeEvent<HTMLInputElement>) {
    addPersonState.name = event.target.value;
    setAddPersonState(addPersonState);
  }
  return (
    <input
      ref={nameInputField}
      onInput={changeName}
      className="block rounded-lg p-3 shadow-lg"
      type="text"
      name="personName"
      placeholder="Name"
    />
  );
}
function InputPersonLocation() {
  const { addPersonState, setAddPersonState, locationInputField } =
    useContext(AddPersonContext);
  function getLocation(event: React.ChangeEvent<HTMLInputElement>) {
    addPersonState.locationString = event.target.value;

    setAddPersonState(addPersonState);
  }

  return (
    <input
      ref={locationInputField}
      onInput={getLocation}
      className="mt-2 block rounded-lg p-3 shadow-lg"
      type="text"
      name="personLocation"
      placeholder="Location"
    />
  );
}

export function AddPersonButton() {
  const { setAddPersonOpen, setAddRelOpen } = useContext(InputOpenContext);
  return (
    <button
      onClick={() => {
        setAddPersonOpen(true);
        setAddRelOpen(false);
      }}
      className="flex gap-3 rounded-lg bg-white p-3 shadow-xl outline-offset-0 outline-blue-500 hover:outline"
    >
      <UserRoundPlus /> Add Person
    </button>
  );
}
