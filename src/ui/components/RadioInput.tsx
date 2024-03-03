import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Types } from "../../types";
import { CheckCircle, Circle, Link, PlusCircle, Trash2 } from "lucide-react";
import { Button, ColorInput, TextInput } from ".";
import { getNewIndex, hexToRGBA } from "../../utils/helpers";

//Todo: Manual selected set prop
export default function RadioInput<T extends Types.RadioItemList>({
  extendable,
  inputItems,
  colorMode,
  deletable,
  onSelectedChange,
  onItemAdded,
  onItemChanged,
  onItemDeleted,
}: {
  deletable?: boolean;
  colorMode?: boolean;
  extendable?: boolean;
  inputItems: T;
  onSelectedChange: (selectedItem: Types.RadioItem | undefined) => void;
  onItemChanged: (changedItem: Types.RadioItem) => void;
  onItemAdded: (addedItem: Types.RadioItem) => void;
  onItemDeleted: (deltedItem: Types.RadioItem) => void;
}) {
  const [items, setItems] = useState<Types.RadioItemList>(inputItems);
  const [selected, setSelected] = useState<Types.RadioItem | undefined>(
    undefined,
  );

  useEffect(() => {
    setItems(inputItems);
  }, [inputItems]);

  useEffect(() => {
    onSelectedChange(selected);
  }, [onSelectedChange, selected]);

  const toggleSelected = useCallback(
    (id: number) => {
      if (items === undefined) return;
      if (selected === undefined) {
        setSelected(items[id]);
        return;
      }
      if (selected.id === id) {
        setSelected(undefined);
        return;
      }
      setSelected(items[id]);
    },
    [items, selected],
  );

  const updateItem = useCallback(
    (id: number, name: string, color: string | undefined) => {
      if (items === undefined) return;

      setItems({
        ...items,
        [id]: {
          ...items[id],
          name: name,
          color: color,
        },
      });
      onItemChanged({ id: id, name: name, color: color });
    },
    [items, onItemChanged],
  );

  const deleteItem = useCallback(
    (id: number) => {
      if (items === undefined) return;
      const newItems = { ...items };
      delete newItems[id];
      setItems({ ...newItems });
      onItemDeleted(items[id]);
    },
    [items, onItemDeleted],
  );

  const addItem = useCallback(
    (name: string, color: string) => {
      const id = getNewIndex(items);
      setItems({
        ...items,
        [id]: {
          id: id,
          name: name,
          color: color,
        },
      });
      onItemAdded({
        id: id,
        name: name,
        color: color,
      });
    },
    [items, onItemAdded],
  );

  return (
    <div>
      <div>
        {items !== undefined &&
          Object.values(items).map((item, index) => (
            <RadioInputItem
              key={index}
              item={item}
              selected={selected?.id === item.id}
              toggleSelected={toggleSelected}
              updateItem={updateItem}
              deleteItem={deleteItem}
              deletable={deletable}
            />
          ))}
      </div>
      <div>
        {extendable && (
          <AddRadioInputItem
            addItem={addItem}
            deletable={deletable}
            colorMode={colorMode}
          />
        )}
      </div>
    </div>
  );
}

function RadioInputItem<Deletable extends boolean>({
  item,
  deletable,
  deleteItem,
  updateItem,
  selected,
  toggleSelected,
}: {
  item: Types.RadioItem;
  updateItem: (id: number, name: string, color: string | undefined) => void;
  toggleSelected: (id: number) => void;
  selected: boolean;
  deletable?: Deletable;
  deleteItem: Deletable extends true ? (id: number) => void : undefined;
}) {
  const id = item.id;
  const name = item.name;
  const color = item.color;

  function handleDelete() {
    if (deleteItem === undefined) return;
    deleteItem(item.id);
  }

  const divStyle = useMemo(() => {
    return {
      backgroundColor: hexToRGBA(color ?? "#ffffff", 0.5) ?? "#ffffff",
    };
  }, [color]);

  return (
    <div
      style={divStyle}
      className="mt-1 flex items-center justify-between gap-3 rounded-lg p-1 pl-3 shadow-lg"
    >
      <div className="flex items-center gap-2">
        <button
          className="pointer-events-auto flex items-center gap-2"
          onClick={() => {
            toggleSelected(id);
          }}
        >
          {selected ? <CheckCircle /> : <Circle />}
        </button>
        <TextInput
          defaultValue={name}
          onBlur={(e) => updateItem(id, e.target.value, color)}
        />
      </div>
      <div className="flex items-center gap-2">
        {color !== undefined && (
          <div className="flex items-center gap-1 p-1">
            <ColorInput
              defaultValue={color}
              onInput={(e) => updateItem(id, name, e.target.value)}
            />
          </div>
        )}
        {deletable && <Button icon={<Trash2 />} onClick={handleDelete} />}
      </div>
    </div>
  );
}

function AddRadioInputItem({
  deletable,
  colorMode,
  addItem,
}: {
  deletable?: boolean;
  colorMode?: boolean;
  addItem: (name: string, color: string) => void;
}) {
  const [name, setName] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string>("#ffffff");
  const textRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  const add = useCallback(() => {
    if (name === undefined) return;
    if (name.length === 0) return;

    addItem(name, color);

    if (textRef.current === null) return;
    textRef.current.value = "";

    if (colorRef.current === null) return;
    colorRef.current.value = "#ffffff";
    setColor("#ffffff");
  }, [addItem, name, color]);

  const divStyle = useMemo(() => {
    return {
      backgroundColor: hexToRGBA(color ?? "#ffffff", 0.5) ?? "#ffffff",
    };
  }, [color]);

  return (
    <div
      style={divStyle}
      className="mt-1 flex items-center justify-between gap-3 rounded-lg p-1 pl-3 shadow-lg"
    >
      <div className="flex items-center gap-2">
        {deletable ? (
          <Link />
        ) : (
          <button onClick={add}>
            <PlusCircle />
          </button>
        )}
        <TextInput ref={textRef} onBlur={(e) => setName(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        {colorMode && (
          <div className="flex items-center gap-1 p-1">
            <ColorInput
              ref={colorRef}
              defaultValue={color}
              onInput={(e) => setColor(e.target.value)}
            />
          </div>
        )}
        {deletable && <Button onClick={add} icon={<PlusCircle />} />}
      </div>
    </div>
  );
}
