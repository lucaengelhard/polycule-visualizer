import { distance, getNewIndex } from "../utils/helpers";
import * as Types from "../types/types";
import { db } from "../db/db";

export default class Link {
  id: number;
  source: Types.Node;
  target: Types.Node;
  type: Types.LinkType;

  //history?: Types.RelHistory;
  distance: number;

  constructor(
    partners: { partner1: Types.Node; partner2: Types.Node },
    type: Types.LinkType,

    //history?: Types.RelHistory,
  ) {
    this.id = getNewIndex(db.links);
    this.source = partners.partner1;
    this.target = partners.partner2;

    this.type = type;

    //this.history = history;

    this.distance = distance(
      partners.partner1.location.lat,
      partners.partner1.location.lon,
      partners.partner2.location.lat,
      partners.partner2.location.lon,
      "K",
    );
  }
}
