import Link from "../classes/link";

// Component types //
export type ButtonType = "confirm" | "deny" | undefined;

export type RadioItems = {
  items: RadioItemList;
  selected?: RadioItem;
};

export type RadioItemList = {
  [key: number]: RadioItem;
};

export type RadioItem = {
  id: number;
  name: string;
  color?: string;
};

// DB types //
export type Node = {
  id: number;
  name: string;
  location: Position;
  index?: number;
  links: Set<keyof LinkList>;
  dx?: number;
  dy?: number;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
};

export type LinkType = {
  name: string;
  id: number;
  color: string;
};

export type Position = {
  name: string;
  lat: number | string;
  lon: number | string;
};

export type DBData = {
  nodes: NodeList;
  links: LinkList;
  linkTypes: LinkTypeList;
};

export type NodeList = {
  [key: number]: Node;
};

export type LinkList = {
  [key: number]: Link;
};

export type LinkTypeList = {
  [key: number]: LinkType;
};

export type DBType = Node | Link | LinkType;
