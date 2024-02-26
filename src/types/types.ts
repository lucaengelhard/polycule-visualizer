import { Relationship } from "../classes/relationship";

export type Person = {
  id: number;
  name: string;
  location: Position;
  index?: number;
  relationships: Relationship[];
};

export type RelType = {
  name: string;
  id: number;
  color: string;
  checked: boolean;
};

export type Position = {
  name: string;
  lat: number;
  lon: number;
};

export type RelHistory = Map<number, RelHistoryEvent>;

export type RelHistoryEvent = {
  date: Date;
  description: string;
};

export type GraphData = {
  nodes: Person[];
  links: Relationship[];
};
