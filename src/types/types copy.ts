import Link from "@/classes/link";

export type Snapshot<Type> = Omit<Type, "snapshots"> & {
  date: Date;
};

export type List<Type> = Map<number, Type>;

export type Node = {
  id: number;
  name: string;
  location: Position;
  links: Set<keyof List<Link>>;
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
  nodes: List<Node>;
  links: List<Link>;
  types: List<Type>;
};

export type GraphData = {
  nodes: Node[];
  links: Link[];
};
