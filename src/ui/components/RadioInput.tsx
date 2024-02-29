import { CheckCircle, Circle, Link2, PlusCircle, Trash2 } from "lucide-react";
import * as Types from "../../types";
import { forwardRef, useEffect, useRef, useState } from "react";
import { getNewIndex, hexToRGBA, rgbaStringToHex } from "../../utils/helpers";
import { Button, ColorInput, TextInput } from ".";

export default function RadioInput<Deletable extends boolean>({
  items,
  setItems,
  color,
  extendable,
  visibleElements,
  deletable,
  deleteID,
}: {
  items: Types.RadioItems;
  setItems: React.Dispatch<React.SetStateAction<Types.RadioItems>>;
  color?: boolean;
  extendable?: boolean;
  visibleElements?: number;
  deletable: Deletable;
  deleteID?: Deletable extends true ? (id: number) => void : undefined;
}) {
  const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined);

  const itemRef = useRef<HTMLDivElement>(null);

  function onClick(index: number) {
    if (items.selected?.id === index) {
      setItems({ ...items, selected: undefined });
    } else {
      setItems({ ...items, selected: items.items[index] });
    }
  }

  useEffect(() => {
    if (itemRef.current) {
      if (visibleElements !== undefined && visibleElements > 0) {
        setMaxHeight(`${visibleElements * itemRef.current.clientHeight}px`);
      }
    }
  }, [visibleElements]);

  return (
    <div>
      <div
        className="no-scrollbar pointer-events-auto mb-3 rounded-lg shadow-xl"
        style={{ maxHeight: maxHeight, overflow: "auto" }}
      >
        {Object.values(items.items).map((value, index) => (
          <RadioInputItem
            key={index}
            index={value.id}
            items={items}
            setItems={setItems}
            onClick={onClick}
            color={color}
            deletable={deletable}
            deleteID={deleteID}
          />
        ))}
      </div>
      {extendable && (
        <AddRadioItem
          ref={itemRef}
          items={items}
          setItems={setItems}
          color={color}
          deletable={deletable}
        />
      )}
    </div>
  );
}
function RadioInputItem<Deletable extends boolean>({
  index,
  items,
  setItems,
  onClick,
  color,
  deletable,
  deleteID,
}: {
  index: number;
  items: Types.RadioItems;
  setItems: React.Dispatch<React.SetStateAction<Types.RadioItems>>;
  onClick: (index: number) => void;
  color?: boolean;
  deletable?: Deletable;
  deleteID?: Deletable extends true ? (id: number) => void : undefined;
}) {
  const [item, setItem] = useState(items.items[index]);

  const divStyle = {
    backgroundColor: hexToRGBA(item.color ?? "#ffffff", 0.5) ?? "#ffffff",
  };

  useEffect(() => {
    setItem(items.items[index]);
  }, [items, index]);

  useEffect(() => {
    if (textRef.current !== null) {
      textRef.current.value = item.name;
    }
  }, [item]);

  const textRef = useRef<HTMLInputElement>(null);

  function setName(event: React.ChangeEvent<HTMLInputElement>) {
    const newItem = item;
    newItem.name = event.target.value;

    setItems({
      ...items,
      items: { ...items.items, [index]: newItem },
    });
  }

  function setColor(event: React.ChangeEvent<HTMLInputElement>) {
    const newItem = item;
    newItem.color = event.target.value;

    setItems({
      ...items,
      items: { ...items.items, [index]: newItem },
    });
  }

  return (
    <>
      {" "}
      {item !== undefined && (
        <div
          style={divStyle}
          className="mt-1 flex items-center justify-between gap-3 rounded-lg p-1 pl-3 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClick(item.id);
              }}
            >
              {item.id === items.selected?.id ? <CheckCircle /> : <Circle />}
            </button>
            <TextInput
              ref={textRef}
              defaultValue={item.name}
              onBlur={(e) => setName(e)}
            />
          </div>

          <div className="flex items-center gap-2">
            {color && (
              <div className="flex items-center gap-1 p-1">
                {" "}
                <ColorInput
                  value={item.color}
                  onInput={(e) => setColor(e)}
                />{" "}
              </div>
            )}
            {deletable && deleteID && (
              <Button icon={<Trash2 />} onClick={() => deleteID(item.id)} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
const AddRadioItem = forwardRef(function AddRadioItem(
  {
    items,
    setItems,
    color,
    deletable,
  }: {
    items: Types.RadioItems;
    setItems: React.Dispatch<React.SetStateAction<Types.RadioItems>>;
    color?: boolean;
    deletable?: boolean;
  },
  ref?: React.ForwardedRef<HTMLDivElement>,
) {
  const [divColor, setDivColor] = useState("#ffffff");
  const [name, setName] = useState<string | undefined>();
  const textInputRef = useRef<HTMLInputElement>(null);

  const divStyle = {
    backgroundColor: hexToRGBA(divColor, 0.5) ?? "#ffffff",
  };

  function onClick() {
    if (name === undefined) {
      throw new Error("Name is undefined");
    }
    const newItem: Types.RadioItem = {
      id: getNewIndex(items.items),
      name: name,
      color: rgbaStringToHex(divColor) ?? "#ffffff",
    };

    setItems({ ...items, items: { ...items.items, [newItem.id]: newItem } });

    if (textInputRef.current) {
      textInputRef.current.value = "";
    }
  }

  return (
    <div
      ref={ref}
      className="mt-1 flex items-center justify-between gap-3 rounded-lg p-1 pl-3 shadow-lg"
      style={divStyle}
    >
      <div className="flex items-center gap-2">
        {deletable !== true ? (
          <button onClick={onClick}>
            <PlusCircle />
          </button>
        ) : (
          <Link2 />
        )}

        <TextInput
          ref={textInputRef}
          onBlur={(e) => setName(e.target.value)}
          placeholder="Add relationship type"
        />
      </div>
      <div className="flex items-center gap-2">
        {color && (
          <div className="flex items-center gap-1 p-1">
            {" "}
            <ColorInput
              defaultValue={divColor}
              onChange={(e) =>
                setDivColor(hexToRGBA(e.target.value, 0.5) ?? "#ffffff")
              }
            />{" "}
          </div>
        )}
        {deletable && <Button icon={<PlusCircle />} onClick={onClick} />}
      </div>
    </div>
  );
});
