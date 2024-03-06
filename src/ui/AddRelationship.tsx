import { Input } from "@/components/ui/input";
import { DatePicker, Radio, Search } from "./components";
import { useCallback, useContext, useRef, useState } from "react";
import { NodeStateContext, TypeStateContext } from "@/App";
import { Types } from "@/types";
import { DB } from "@/db";
import { Helpers } from "@/utils";
import Link from "@/classes/link";
import { Button } from "@/components/ui/button";
import { LucideLink } from "lucide-react";

export default function AddRelationship() {
  const LinkTypes = useContext(TypeStateContext);
  const Nodes = useContext(NodeStateContext);

  const [source, setSource] = useState<Types.Node>();
  const [sourceQuery, setSourceQuery] = useState<string>();
  const sourceRef = useRef<HTMLInputElement>(null);

  const [target, setTarget] = useState<Types.Node>();
  const [targetQuery, setTargetQuery] = useState<string>();
  const targetRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState<Date>();
  const [selected, setSelected] = useState<Types.Type>();

  const onSelectedToggle = useCallback((item: Types.Type, active: boolean) => {
    if (active) {
      setSelected(item);
      return;
    }

    setSelected(undefined);
  }, []);

  const onItemUpdate = useCallback(
    (item: Types.Type, name: string, color?: string | undefined) => {
      DB.update(item.id, "type", { ...item, name: name, color });
    },
    [],
  );

  const onItemAdded = useCallback(
    (name: string, color?: string | undefined) => {
      if (color === undefined) {
        //TODO: Alert
        return;
      }

      DB.add({
        color: color,
        name: name,
        id: Helpers.getNewIndex(DB.data.types),
      });

      //TODO: Succes Sonner
    },
    [],
  );

  function submit() {
    if (source === undefined) {
      //TODO: Alert
      return;
    }

    if (target === undefined) {
      //TODO: Alert
      return;
    }

    if (target.id === source.id) {
      //TODO: Alert
      return;
    }

    if (date === undefined) {
      //TODO: Alert
      return;
    }

    if (selected === undefined) {
      //TODO: Alert
      return;
    }

    const newLink = new Link(
      source,
      target,
      selected,
      date,
      Helpers.getNewIndex(DB.data.links),
      new Map(),
      false,
    );

    const res = DB.add(newLink);

    if (res === undefined) {
      //TODO: Alert
      return;
    }

    setSource(undefined);
    setTarget(undefined);
    setDate(undefined);
    setSelected(undefined);
  }

  function onSourceResult(result: Types.Node) {
    setSourceQuery(undefined);
    setSource(result);

    if (sourceRef.current !== null) {
      sourceRef.current.value = result.name;
    }
  }

  function onTargetResult(result: Types.Node) {
    setTargetQuery(undefined);
    setTarget(result);

    if (targetRef.current !== null) {
      targetRef.current.value = result.name;
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex gap-3">
        <div>
          <Input
            ref={sourceRef}
            placeholder="Partner"
            onInput={(e) => setSourceQuery(e.currentTarget.value)}
          />
          <Search
            className="w-[calc(50%-1rem)]"
            query={sourceQuery}
            list={Nodes}
            onResult={onSourceResult}
          />
        </div>
        <div>
          <Input
            ref={targetRef}
            placeholder="Partner"
            onInput={(e) => setTargetQuery(e.currentTarget.value)}
          />
          <Search
            className="w-[calc(50%-1rem)]"
            query={targetQuery}
            list={Nodes}
            onResult={onTargetResult}
          />
        </div>
      </div>
      <DatePicker onDateChange={(date) => setDate(date)} />
      <Radio
        onItemAdded={onItemAdded}
        list={LinkTypes}
        onSelectedToggle={onSelectedToggle}
        onItemUpdate={onItemUpdate}
        extandable
        colorMode
        selectedItem={selected}
      />
      <Button onClick={submit} className="flex gap-3">
        <LucideLink />
        Submit
      </Button>
    </div>
  );
}
