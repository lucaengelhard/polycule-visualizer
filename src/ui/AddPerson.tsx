import WinBox from "react-winbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { Helpers } from "@/utils";
import { DB } from "@/db";
import { Types } from "@/types";
import { Alert, DatePicker } from "./components";

//TODO: loading button
export default function AddPerson({
  setAddPerson,
}: {
  setAddPerson: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [name, setName] = useState<string | undefined>(undefined);
  const [locationstring, setLocationstring] = useState<string | undefined>(
    undefined,
  );
  const [date, setDate] = useState<Date>();

  const [alert, setAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState<ReactNode | undefined>(
    undefined,
  );
  const [alertBody, setAlertBody] = useState<ReactNode | undefined>(undefined);

  const [height, setHeight] = useState(100);

  const body = useRef<HTMLDivElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  async function submit() {
    if (name === undefined || name.length === 0) {
      setAlertTitle("Name not defined");
      setAlertBody(
        "To add a new Person you have to set the name of the person",
      );
      setAlert(true);
      return;
    }

    if (locationstring === undefined || locationstring.length === 0) {
      setAlertTitle("Location not defined");
      setAlertBody(
        "To add a new Person you have to set the location of the person",
      );
      setAlert(true);
      return;
    }

    if (date === undefined) {
      setAlertTitle("Date not defined");
      setAlertBody("To add a new Person you have to set a date");
      setAlert(true);
      return;
    }

    const location = await Helpers.geoCode(locationstring);

    if (location === undefined) {
      setAlertTitle("Location not found");
      setAlertBody("The given Location wasn't found");
      setAlert(true);
      return;
    }

    const node: Types.Node = {
      name: name,
      location: location,
      date: date,
      id: Helpers.getNewIndex(DB.data.nodes),
      links: new Set(),
      snapshots: new Map(),
    };

    const res = DB.add(node);

    if (res === undefined) {
      setAlertTitle("Error");
      setAlertBody("Error while adding person");
      setAlert(true);
      return;
    }

    setName(undefined);
    setLocationstring(undefined);
    setDate(undefined);

    if (nameRef.current) {
      nameRef.current.value = "";
    }

    if (locationRef.current) {
      locationRef.current.value = "";
    }
  }

  setTimeout(() => {
    if (body.current !== null) {
      setHeight(body.current.clientHeight + 36);
    }
  }, 100);

  return (
    <WinBox
      title="Add Person"
      height={height}
      x={"center"}
      y={"center"}
      noResize
      noFull
      noMax
      onClose={() => setAddPerson(false)}
    >
      <div ref={body} className="grid gap-3 p-3">
        <Input
          onBlur={(e) => setName(e.target.value)}
          ref={nameRef}
          placeholder="Name"
        />
        <Input
          onBlur={(e) => setLocationstring(e.target.value)}
          ref={locationRef}
          placeholder="Location"
        />
        <DatePicker onDateChange={(date) => setDate(date)} />
        <Button onClick={submit} className="flex gap-3">
          <UserRoundPlus />
          Submit
        </Button>
        <Alert
          open={alert}
          title={alertTitle}
          onContinue={() => setAlert(false)}
        >
          {alertBody}
        </Alert>
      </div>
    </WinBox>
  );
}
