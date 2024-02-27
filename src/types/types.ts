import { Relationship } from "../classes/relationship";

export type Person = {
  id: number;
  name: string;
  location: Position;
  index?: number;
  relationships: Relationship[];
};

export interface GraphNode extends Person {
  dx?: number;
  dy?: number;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

export interface GraphLink extends Relationship {
  source: number | GraphNode;
  target: number | GraphNode;
}

export type RelType = {
  name: string;
  id: number;
  color: string;
  checked?: boolean;
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

export type DBData = {
  nodes: Person[];
  links: Relationship[];
  relTypes?: Map<number, RelType>;
};

export interface GraphData extends DBData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export type addRelState = {
  queriedPartners: {
    0: Person[];
    1: Person[];
  };
  selectedPartners: {
    0?: Person;
    1?: Person;
  };
  relTypes: { items: RelType[]; selected?: RelType | undefined };
};

export type DragEvent = { active: boolean };
