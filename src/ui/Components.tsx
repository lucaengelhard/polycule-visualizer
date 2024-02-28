import { CheckCircle, Circle, PlusCircle } from "lucide-react";
import * as Types from "../types/types";
import { ReactNode, forwardRef, useEffect, useRef, useState } from "react";
import { getNewIndex, hexToRGBA, rgbaStringToHex } from "../utils/helpers";

export function Button({
  label,
  icon,
  onClick,
  type,
  additionalClasses,
}: {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  type?: Types.ButtonType;
  additionalClasses?: string;
}) {
  const [conditionalClasses, setConditonalClasses] = useState(
    "outline-offset-0 outline-blue-500 hover:outline",
  );

  useEffect(() => {
    switch (type) {
      case "confirm":
        setConditonalClasses("hover:bg-green-500");
        break;
      case "deny":
        setConditonalClasses("hover:bg-red-500");
        break;
      default:
        setConditonalClasses("outline-offset-0 outline-blue-500 hover:outline");
        break;
    }
  }, [type]);

  return (
    <button
      onClick={onClick}
      className={
        "flex h-min w-min gap-3 whitespace-nowrap rounded-lg bg-white p-3 shadow-xl transition-colors " +
        conditionalClasses +
        " " +
        additionalClasses
      }
    >
      {icon}
      {label}
    </button>
  );
}

export const TextInput = forwardRef(function TextInput(
  {
    defaultValue,
    value,
    placeholder,
    onChange,
    onInput,
    onBlur,
    additionalClasses,
  }: {
    defaultValue?: string;
    value?: string;
    placeholder?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    additionalClasses?: string;
  },
  ref?: React.ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      className={"h-min w-min rounded-lg p-3 shadow-lg " + additionalClasses}
      type="text"
      defaultValue={defaultValue}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onInput={onInput}
      onBlur={onBlur}
      ref={ref}
    ></input>
  );
});

export function ColorInput({
  value,
  defaultValue,
  onChange,
  onInput,
  onBlur,
  additionalClasses,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  additionalClasses?: string;
}) {
  return (
    <input
      type="color"
      className={
        "aspect-square h-10 w-10 rounded-lg border-none " + additionalClasses
      }
      onChange={onChange}
      onInput={onInput}
      onBlur={onBlur}
      value={value}
      defaultValue={defaultValue}
    />
  );
}

export function RadioInput({
  items,
  setItems,
  color,
  extendable,
}: {
  items: Types.RadioItems;
  setItems: React.Dispatch<React.SetStateAction<Types.RadioItems>>;
  color?: boolean;
  extendable?: boolean;
}) {
  const [itemsArray, setItemsArray] = useState<Types.RadioItem[]>();

  useEffect(() => {
    const newArray = [];
    for (const item in items.items) {
      newArray.push(items.items[item]);
    }

    setItemsArray(newArray);
  }, [items]);

  function onClick(index: number) {
    if (items.selected?.id === index) {
      setItems({ ...items, selected: undefined });
    } else {
      setItems({ ...items, selected: items.items[index] });
    }
  }

  return (
    <div>
      {itemsArray?.map((_item, index) => (
        <RadioInputItem
          key={index}
          index={index}
          items={items}
          setItems={setItems}
          onClick={onClick}
          color={color}
        />
      ))}

      {extendable && (
        <AddRadioItem items={items} setItems={setItems} color={color} />
      )}
    </div>
  );
}

function RadioInputItem({
  index,
  items,
  setItems,
  onClick,
  color,
}: {
  index: number;
  items: Types.RadioItems;
  setItems: React.Dispatch<React.SetStateAction<Types.RadioItems>>;
  onClick: (index: number) => void;
  color?: boolean;
}) {
  const [item, setItem] = useState(items.items[index]);

  const divStyle = {
    backgroundColor: hexToRGBA(item.color ?? "#ffffff", 0.5) ?? "#ffffff",
  };

  useEffect(() => {
    setItem(items.items[index]);
  }, [items, index]);

  function setName(event: React.ChangeEvent<HTMLInputElement>) {
    const newItem = item;
    newItem.name = event.target.value;

    const newItems = { ...items.items };
    newItems[index] = newItem;

    setItems({
      ...items,
      items: newItems,
    });
  }

  function setColor(event: React.ChangeEvent<HTMLInputElement>) {
    const newItem = item;
    newItem.color = event.target.value;

    const newItems = { ...items.items };
    newItems[index] = newItem;

    setItems({
      ...items,
      items: newItems,
    });
  }

  return (
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
        <TextInput defaultValue={item.name} onBlur={(e) => setName(e)} />
      </div>

      {color && (
        <div className="flex items-center gap-1 p-1">
          {" "}
          <ColorInput value={item.color} onChange={(e) => setColor(e)} />{" "}
        </div>
      )}
    </div>
  );
}

function AddRadioItem({
  items,
  setItems,
  color,
}: {
  items: Types.RadioItems;
  setItems: React.Dispatch<React.SetStateAction<Types.RadioItems>>;
  color?: boolean;
}) {
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
      className="mt-1 flex items-center justify-between gap-3 rounded-lg p-1 pl-3 shadow-lg"
      style={divStyle}
    >
      <div className="flex items-center gap-2">
        <button onClick={onClick}>
          <PlusCircle />
        </button>
        <TextInput
          ref={textInputRef}
          onBlur={(e) => setName(e.target.value)}
          placeholder="Add relationship type"
        />
      </div>

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
    </div>
  );
}
