import WinBox from "react-winbox";
import { Input } from "@/components/ui/input";
import { Radio } from "./components";
import { useCallback, useContext, useRef, useState } from "react";
import { TypeStateContext } from "@/App";
import { Types } from "@/types";
import { DB } from "@/db";
import { Helpers } from "@/utils";

export default function AddRelationship({
  setAddRelationship,
}: {
  setAddRelationship: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const Types = useContext(TypeStateContext);
  const [selected, setSelected] = useState<Types.Type>();
  const [height, setHeight] = useState(100);
  const body = useRef<HTMLDivElement>(null);

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
      onClose={() => setAddRelationship(false)}
    >
      <div ref={body} className="grid gap-3 p-3">
        <div className="flex gap-3">
          <Input placeholder="Partner" />
          <Input placeholder="Partner" />
        </div>
        <Radio
          onItemAdded={onItemAdded}
          list={Types}
          onSelectedToggle={onSelectedToggle}
          onItemUpdate={onItemUpdate}
          extandable
          colorMode
          selectedItem={selected}
        />
      </div>
    </WinBox>
  );
}
