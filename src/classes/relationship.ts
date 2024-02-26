import { distance } from "../utils/helpers";
import * as Types from "../types/types";

export class Relationship {
  source: number;
  target: number;
  type: Types.RelType;
  exclusive: boolean;
  history?: Types.RelHistory;
  distance: number;

  constructor(
    partners: { partner1: Types.Person; partner2: Types.Person },
    type: Types.RelType,
    exclusive: boolean,
    history?: Types.RelHistory,
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
      "K",
    );
  }
}
