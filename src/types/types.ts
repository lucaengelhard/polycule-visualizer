import Link from "@/classes/link";

export type Snapshot<Type> = Omit<
  Type,
  "snapshots" | "getSnapshot" | "addSnapshot" | "deleteSnapshot"
>;

export type List<Type, Index extends string | number = number> = Map<
  Index,
  Type
>;

export type Node = {
  id: number;
  name: string;
  date: Date;
  location: Position;
  links: Set<number>;
  snapshots: List<Snapshot<Node>>;
};

export type Position = {
  name: string;
  lat: number;
  lon: number;
};

export type Type = {
  id: number;
  name: string;
  color: string;
};

export type DBData = {
  nodes: List<Node, Node["id"]>;
  links: List<Link, Link["id"]>;
  types: List<Type, Type["id"]>;
};

export type GraphData = {
  nodes: Node[];
  links: Link[];
};
