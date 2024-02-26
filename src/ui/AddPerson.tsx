import { PlusCircle, UserRoundPlus } from "lucide-react";
import { createContext, useContext, useRef, useState } from "react";
import * as Types from "../types/types";
import { db } from "../db/db";
import { geoCode } from "../utils/geocode";
import { InputOpenContext } from "./Input";

const AddPersonContext = createContext<{
  addPersonState: { name: string; locationString: string };
  setAddPersonState: React.Dispatch<
    React.SetStateAction<{ name: string; locationString: string }>
  >;
  nameInputField: React.RefObject<HTMLInputElement>;
  locationInputField: React.RefObject<HTMLInputElement>;
}>(null);

export function AddPersonButton() {
  const { setAddPersonOpen, setAddRelOpen } = useContext(InputOpenContext);
  return (
    <button
      onClick={() => {
        setAddPersonOpen(true);
        setAddRelOpen(false);
      }}
      className="flex gap-3 p-3 rounded-lg shadow-xl "
    >
      <UserRoundPlus /> Add Person
    </button>
  );
}
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

    //console.log(person);
    //Add to db
    db.nodes.push(person);
    console.log(db.nodes);
    //update Graph
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
      <fieldset className="m-0 p-3 shadow-lg rounded-lg inline-block absolute top-3 left-3 bg-white">
        <InputPersonName />
        <InputPersonLocation />
        <div className="flex gap-3">
          <button
            onClick={addPerson}
            className="flex gap-3 mt-3 p-3 rounded-lg shadow-lg hover:bg-green-500 transition-colors"
          >
            <PlusCircle />
            Submit
          </button>
          <button
            onClick={() => setAddPersonOpen(false)}
            className="flex gap-3 mt-3 p-3 rounded-lg shadow-lg hover:bg-red-500 transition-colors"
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
      className="p-3 rounded-lg shadow-lg block"
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
      className="p-3 mt-2 rounded-lg shadow-lg block"
      type="text"
      name="personLocation"
      placeholder="Location"
    />
  );
}
