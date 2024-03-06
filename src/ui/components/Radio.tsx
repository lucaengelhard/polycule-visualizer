import { Types } from "@/types";
import { Helpers } from "@/utils";
import { useMemo, useRef, useState } from "react";
import { CheckCircle, Circle, PlusCircle } from "lucide-react";
import { ColorInput, Toggle } from ".";
import { Input } from "@/components/ui/input";

export default function Radio<
  Item extends { id: number | string; name: string; color?: string },
  List extends Types.List<Item, Item["id"]>,
>({
  list,
  selectedItem,
  onSelectedToggle,
  onItemUpdate,
  onItemAdded,
  colorMode,
  extandable,
}: {
  list: List;
  selectedItem?: Item;
  onSelectedToggle: (item: Item, selected: boolean) => void;
  onItemUpdate: (item: Item, name: Item["name"], color?: Item["color"]) => void;
  onItemAdded: (name: string, color?: string) => void;
  colorMode?: boolean;
  extandable?: boolean;
}) {
  return (
    <div className="grid gap-1">
      {Array.from(list.values()).map((item) => (
        <RadioItem
          key={item.id}
          item={item}
          onItemUpdate={onItemUpdate}
          onSelectedToggle={onSelectedToggle}
          selected={selectedItem?.id === item.id}
          colorMode={colorMode}
        />
      ))}
      {extandable && (
        <AddRadioItem onItemAdded={onItemAdded} colorMode={colorMode} />
      )}
    </div>
  );
}

function RadioItem<
  Item extends { id: number | string; name: string; color?: string },
>({
  item,
  onItemUpdate,
  onSelectedToggle,
  selected,
  colorMode,
}: {
  item: Item;
  onItemUpdate: (item: Item, name: Item["name"], color?: Item["color"]) => void;
  onSelectedToggle: (item: Item, selected: boolean) => void;
  selected: boolean;
  colorMode?: boolean;
}) {
  const name = item.name;
  const color = item.color;

  function onToggle(active: boolean) {
    onSelectedToggle(item, active);
  }

  const divStyle = useMemo(() => {
    return {
      backgroundColor: Helpers.hexToRGBA(color ?? "#ffffff", 0.5) ?? "#ffffff",
    };
  }, [color]);

  return (
    <div style={divStyle} className="flex gap-3 rounded-md p-1">
      <Toggle
        active={selected}
        activeContent={<CheckCircle />}
        inActiveContent={<Circle />}
        onToggle={onToggle}
      />
      <Input
        placeholder={name}
        onBlur={(e) => {
          if (e.target.value.length === 0) {
            return;
          }
          onItemUpdate(item, e.target.value, color);
        }}
      />

      {colorMode && (
        <ColorInput
          defaultValue={color}
          onInput={(e) => onItemUpdate(item, name, e.target.value)}
        />
      )}
    </div>
  );
}

function AddRadioItem({
  colorMode,
  onItemAdded,
}: {
  colorMode?: boolean;
  onItemAdded: (name: string, color?: string) => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>();
  const [color, setColor] = useState<string>();

  function submit() {
    if (name === undefined) {
      //TODO: Alert
      return;
    }

    if (color === undefined && colorMode) {
      //TODO: Alert
      return;
    }

    onItemAdded(name, color);
  }

  const divStyle = useMemo(() => {
    return {
      backgroundColor: Helpers.hexToRGBA(color ?? "#ffffff", 0.5) ?? "#ffffff",
    };
  }, [color]);

  return (
    <div
      style={divStyle}
      className=" flex content-between gap-3 rounded-md p-1"
    >
      <div className="flex w-full gap-3">
        <button className="p-1" onClick={submit}>
          <PlusCircle />
        </button>
        <Input
          onBlur={(e) => setName(e.target.value)}
          ref={nameRef}
          placeholder="Name"
        />
      </div>
      {colorMode && <ColorInput onInput={(e) => setColor(e.target.value)} />}
    </div>
  );
}
