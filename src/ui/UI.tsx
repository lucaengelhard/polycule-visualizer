import { createContext, useState } from "react";
import { AddPersonButton, AddPerson } from "./AddPerson";
import { AddRelationshipButton, AddRelationship } from "./AddRelationship";
import SaveLoad from "./SaveLoad";

export const InputOpenContext = createContext<{
  addPersonOpen: boolean;
  setAddPersonOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addRelOpen: boolean;
  setAddRelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>(null);

export default function UI() {
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const [addRelOpen, setAddRelOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex h-min justify-between p-3">
      <InputOpenContext.Provider
        value={{ addPersonOpen, setAddPersonOpen, addRelOpen, setAddRelOpen }}
      >
        <div className="flex gap-3">
          <AddPersonButton />
          <AddRelationshipButton />
        </div>

        {addPersonOpen && !addRelOpen && <AddPerson />}
        {addRelOpen && !addPersonOpen && <AddRelationship />}
      </InputOpenContext.Provider>

      <SaveLoad />
    </div>
  );
}
