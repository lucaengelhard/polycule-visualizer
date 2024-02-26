import { createContext, useState } from "react";
import * as Types from "../types/types";
import { AddPersonButton, AddPerson } from "./AddPerson";
import { AddRelationshipButton, AddRelationship } from "./AddRelationship";

export const InputOpenContext = createContext<{
  addPersonOpen: boolean;
  setAddPersonOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addRelOpen: boolean;
  setAddRelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>(null);

export default function Input() {
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const [addRelOpen, setAddRelOpen] = useState(false);

  return (
    <InputOpenContext.Provider
      value={{ addPersonOpen, setAddPersonOpen, addRelOpen, setAddRelOpen }}
    >
      <div className="absolute top-3 left-3">
        <AddPersonButton />
        <AddRelationshipButton />
      </div>

      {addPersonOpen && !addRelOpen && <AddPerson />}
      {addRelOpen && !addPersonOpen && <AddRelationship />}
    </InputOpenContext.Provider>
  );
}
