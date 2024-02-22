import { distance } from "./helpers";

type GraphData = {
  nodes: Person[];
  links: Relationship[];
};

type Person = {
  id: number;
  name: string;
  location: Position;
  age: number;
};

type Position = {
  name: string;
  lat: number;
  lon: number;
};

type RelType = {
  name: string;
  value: number;
};

type RelHistory = Map<number, RelHistoryEvent>;

type RelHistoryEvent = {
  date: Date;
  description: string;
};

export class Relationship {
  source: number;
  target: number;
  type: RelType;
  exclusive: boolean;
  history?: RelHistory;
  distance: number;

  constructor(
    partners: { partner1: Person; partner2: Person },
    type: RelType,
    exclusive: boolean,
    history?: RelHistory
  ) {
    this.source = partners.partner1.id;
    this.target = partners.partner2.id;
    this.type = type;
    this.history = history;
    this.exclusive = exclusive;
    this.distance = distance(
      partners.partner1.location.lat,
      partners.partner1.location.lon,
      partners.partner2.location.lat,
      partners.partner2.location.lon,
      "K"
    );
  }
}

export const romantic: RelType = {
  name: "romantic",
  value: 10,
};

export const platonic: RelType = {
  name: "platonic",
  value: 5,
};

const luca: Person = {
  id: 0,
  name: "Luca",
  location: {
    name: "Vorderdupfingen",
    lat: 47.766099,
    lon: 8.094229,
  },
  age: 22,
};

const michi: Person = {
  id: 1,
  name: "Michi",
  location: {
    name: "Hinterdupfingen",
    lat: 47.994517,
    lon: 8.248138,
  },
  age: 27,
};

const lilli: Person = {
  id: 2,
  name: "Lilli",
  location: {
    name: "Hinterdupfingen",
    lat: 47.990841,
    lon: 8.121713,
  },
  age: 27,
};

const MichiLuca = new Relationship(
  { partner1: luca, partner2: michi },
  romantic,
  false
);

const MichiLilli = new Relationship(
  { partner1: michi, partner2: lilli },
  platonic,
  false
);

export let graph: GraphData = {
  nodes: [luca, michi],
  links: [MichiLuca],
};
