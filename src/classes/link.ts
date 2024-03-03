import { distance, getNewIndex } from "../utils/helpers";
import { Types } from "../types";
import { db } from "../db/db";

export default class Link {
  id: number;
  source: Types.Node;
  target: Types.Node;
  type: Types.LinkType;
  distance: number;
  history?: Types.HistoryLinkList;

  constructor(
    partners: { partner1: Types.Node; partner2: Types.Node },
    type: Types.LinkType,
    history?: Types.HistoryLinkList,
  ) {
    this.id = getNewIndex(db.links);
    this.source = partners.partner1;
    this.target = partners.partner2;

    this.type = type;
    this.history = history;

    if (typeof partners.partner1.location.lat === "string") {
      partners.partner1.location.lat = parseFloat(
        partners.partner1.location.lat,
      );
    }

    if (typeof partners.partner1.location.lon === "string") {
      partners.partner1.location.lon = parseFloat(
        partners.partner1.location.lon,
      );
    }

    if (typeof partners.partner2.location.lat === "string") {
      partners.partner2.location.lat = parseFloat(
        partners.partner2.location.lat,
      );
    }

    if (typeof partners.partner2.location.lon === "string") {
      partners.partner2.location.lon = parseFloat(
        partners.partner2.location.lon,
      );
    }

    this.distance = distance(
      partners.partner1.location.lat,
      partners.partner1.location.lon,
      partners.partner2.location.lat,
      partners.partner2.location.lon,
      "K",
    );
  }
}
