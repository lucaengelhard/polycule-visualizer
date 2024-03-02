import { useContext, useRef, useState } from "react";
import { DBContext } from "../App";

import { UserRoundPlus } from "lucide-react";
import { geoCode } from "../utils/geocode";
import { update } from "../db";
import { getNewIndex } from "../utils/helpers";
import { Button, TextInput } from "./components";

export default function AddPerson() {
  const { DBState } = useContext(DBContext);

  const [name, setName] = useState<string | undefined>(undefined);
  const [locationstring, setLocationstring] = useState<string | undefined>(
    undefined,
  );

  const nameRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  async function submit() {
    if (locationstring === undefined || locationstring.length === 0)
      throw new Error("Location undefined");
    if (name === undefined || name.length === 0)
      throw new Error("Name undefined");
    const location = await geoCode(locationstring);

    update(
      "nodes",
      {
        name: name,
        location: location,
        id: getNewIndex(DBState.nodes),
        links: new Set([]),
      },
      "add",
    );

    setName(undefined);
    setLocationstring(undefined);

    if (nameRef.current) {
      nameRef.current.value = "";
    }

    if (locationRef.current) {
      locationRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-3 rounded-lg  p-3 shadow-lg">
      <TextInput
        ref={nameRef}
        placeholder="Name"
        onBlur={(e) => setName(e.target.value)}
      />
      <TextInput
        ref={locationRef}
        placeholder="Location"
        onBlur={(e) => setLocationstring(e.target.value)}
      />
      <Button
        label="Add Person"
        icon={<UserRoundPlus />}
        type="confirm"
        onClick={submit}
      />
    </div>
  );
}
