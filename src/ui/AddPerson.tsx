import { useRef, useState } from "react";

import { UserRoundPlus } from "lucide-react";
import { geoCode } from "../utils/geocode";

import { Button, TextInput } from "./components";
import { update } from "../db/db";

export default function AddPerson() {
  async function submit() {
    update(
      "nodes",
      {
        name: name,
        location: location,
        id: -10,
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
