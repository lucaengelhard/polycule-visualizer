import { cn } from "@/lib/utils";
import { Types } from "@/types";
import React, { useMemo } from "react";

export default function Search<
  Item extends { id: string | number; name: string },
  List extends Types.List<Item>,
>({
  list,
  onResult,
  query,
  className,
}: {
  list: List;
  onResult: (result: Item) => void;
  query?: string;
  className?: string;
}) {
  const suggestions = useMemo(() => {
    if (query !== undefined) {
      return Array.from(list.values()).filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
    }
  }, [list, query]);

  return (
    <>
      {query !== undefined &&
        query.length > 0 &&
        suggestions !== undefined &&
        suggestions.length > 0 && (
          <ul
            className={cn(
              "absolute mt-2 max-w-full rounded-md bg-accent",
              className,
            )}
          >
            {suggestions.map((item) => (
              <SearchItem key={item.id} item={item} onResult={onResult} />
            ))}
          </ul>
        )}
    </>
  );
}

function SearchItem<Item extends { id: string | number; name: string }>({
  item,
  onResult,
}: {
  item: Item;
  onResult: (result: Item) => void;
}) {
  function onKeyPress(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter") {
      onResult(item);
    }
  }

  return (
    <li className="pointer-events-auto w-full cursor-pointer">
      <button
        onClick={() => onResult(item)}
        onKeyDown={onKeyPress}
        className="w-full  overflow-hidden text-ellipsis  rounded-md p-2 text-left font-bold outline-offset-0 outline-blue-500 hover:outline"
      >
        {item.name}
      </button>
    </li>
  );
}
