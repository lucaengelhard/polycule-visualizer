import { DB } from "@/db";
import { Types } from "@/types";
import { Helpers } from "@/utils";

export default class Link {
  id: number;
  source: number;
  target: number;
  type: number;
  distance: number;
  date: Date;
  snapshots?: Types.List<Types.Snapshot<Link>>;

  constructor(
    source: Types.Node,
    target: Types.Node,
    type: Types.Type,
    date: Date,
    id?: number,
    snapshots?: Types.List<Types.Snapshot<Link>>,
    isSnapshot?: boolean,
  ) {
    this.id = id ?? Helpers.getNewIndex(DB.data.links);
    this.source = source.id;
    this.target = target.id;
    this.type = type.id;

    this.distance = Helpers.distance(
      source.location.lat,
      source.location.lon,
      target.location.lat,
      target.location.lon,
      "K",
    );

    this.date = date;

    this.snapshots =
      isSnapshot === true
        ? undefined
        : snapshots === undefined
          ? new Map()
          : snapshots;

    if (!isSnapshot && this.snapshots !== undefined) {
      const snapshot = { ...this };
      delete snapshot.snapshots;
      this.snapshots.set(this.date.getTime(), snapshot);
    }

    if (isSnapshot && this.snapshots !== undefined) {
      delete this.snapshots;
    }
  }

  addSnapshot(snapshot: Types.Snapshot<Link>) {
    if (this.snapshots === undefined)
      throw new Error("Object is Snapshot -> don't add Snapshots to Snapshots");
    this.snapshots.set(snapshot.date.getTime(), snapshot);
  }

  deleteSnapshot<T extends Types.Snapshot<Link> | Date | number>(input: T) {
    if (this.snapshots === undefined) throw new Error("Snapshots undefined");
    if (typeof input === "number") {
      this.snapshots.delete(input);
      return;
    }

    if (Link.typeCheckLinkSnapshot(input)) {
      this.snapshots.delete(input.date.getTime());
      return;
    }

    this.snapshots.delete(input.getTime());
  }

  getSnapshot(date: Date | number): Types.Snapshot<Link> {
    if (this.snapshots === undefined) return this;
    if (this.snapshots.size === 0) return this;

    let toFind = date;
    if (typeof toFind !== "number") {
      toFind = toFind.getTime();
    }

    const directFind = this.snapshots.get(toFind);
    if (directFind !== undefined) {
      return directFind;
    }

    const snapshotDates = Array.from(this.snapshots.keys()).sort(
      (a, b) => a - b,
    );

    const snapshotIndex = Helpers.findSnapshotIndex(toFind, snapshotDates);

    const snapshot = this.snapshots.get(snapshotIndex);

    if (snapshot === undefined) return this;

    return snapshot;
  }

  static typeCheckLinkSnapshot(input: unknown): input is Types.Snapshot<Link> {
    if (typeof input !== "object") {
      return false;
    }

    if (
      (input as Types.Snapshot<Link>).date === undefined ||
      typeof (input as Types.Snapshot<Link>).id !== "number" ||
      typeof (input as Types.Snapshot<Link>).source !== "number" ||
      typeof (input as Types.Snapshot<Link>).target !== "number" ||
      typeof (input as Types.Snapshot<Link>).target !== "number" ||
      typeof (input as Types.Snapshot<Link>).distance !== "number"
    ) {
      return false;
    }

    return true;
  }
}
