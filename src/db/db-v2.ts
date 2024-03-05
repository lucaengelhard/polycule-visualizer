/* eslint-disable no-case-declarations */
import Link from "@/classes/link";
import { Types, TypeChecks } from "@/types";
import { Helpers } from "@/utils";

export const data: Types.DBData = {
  nodes: new Map(),
  links: new Map(),
  types: new Map(),
};

export function add(payload: Types.Node | Types.Type | Link) {
  if (TypeChecks.node(payload)) {
    payload.id = Helpers.getNewIndex(data.nodes, payload.id);
    data.nodes.set(payload.id, payload);
    return data.nodes.get(payload.id);
  }

  if (TypeChecks.link(payload) && payload instanceof Link) {
    payload.id = Helpers.getNewIndex(data.links, payload.id);
    data.links.set(payload.id, payload);

    const source = data.nodes.get(payload.source);
    const target = data.nodes.get(payload.target);

    if (source === undefined || target === undefined) {
      throw new Error("source or target undefined");
    }

    source.links.add(payload.id);
    target.links.add(payload.id);
    return data.links.get(payload.id);
  }

  if (TypeChecks.type(payload)) {
    payload.id = Helpers.getNewIndex(data.types, payload.id);
    data.types.set(payload.id, payload);
    return data.types.get(payload.id);
  }

  throw new Error("Adding payload to DB failed");
}

export function remove(id: number, type: "node" | "type" | "link") {
  switch (type) {
    case "node":
      const node = data.nodes.get(id);
      if (node === undefined) return;

      node.links.forEach((link) => {
        data.links.delete(link);
      });

      data.nodes.delete(id);
      break;
    case "link":
      const link = data.links.get(id);
      if (link === undefined) return;

      const source = data.nodes.get(link.source);
      if (source !== undefined) {
        source.links.delete(id);
      }

      const target = data.nodes.get(link.target);
      if (target !== undefined) {
        target.links.delete(id);
      }

      data.links.delete(id);
      break;
    case "type":
      const type = data.types.get(id);

      if (type === undefined) return;

      const links = Array.from(data.links.values()).filter(
        (link) => link.type === id,
      );

      links.forEach((link) => {
        const refLink = data.links.get(link.id);
        if (refLink === undefined) return;

        //TODO: Define "noLink" link type
        refLink.type = -1;
      });

      data.types.delete(id);
      break;
    default:
      throw new Error(`type: "${type}" is not defined`);
      break;
  }
}

export function update<T extends "node" | "type" | "link">(
  id: number,
  type: T,
  toChange: Omit<
    Partial<
      T extends "node"
        ? Types.Node
        : T extends "type"
          ? Types.Type
          : T extends "link"
            ? Link
            : undefined
    >,
    "id" | "source" | "target"
  >,
) {
  if (type === "node") {
    const refNode = data.nodes.get(id);
    if (refNode === undefined) return;

    const toChangeNode = toChange as Omit<Partial<Types.Node>, "id">;

    if (toChangeNode.name !== undefined) {
      refNode.name = toChangeNode.name;
    }

    if (toChangeNode.date !== undefined) {
      refNode.date = toChangeNode.date;
    }

    if (toChangeNode.links !== undefined) {
      refNode.links = toChangeNode.links;
    }

    if (toChangeNode.location !== undefined) {
      refNode.location = toChangeNode.location;
      refNode.links.forEach((id) => {
        const link = data.links.get(id);
        if (link === undefined) return;

        const source = data.nodes.get(link.source);
        const target = data.nodes.get(link.target);

        if (source === undefined || target === undefined) return;

        const changingNode = source.id === refNode.id ? source : target;
        const otherNode = source.id === refNode.id ? target : source;

        link.distance = Helpers.distance(
          changingNode.location.lat,
          changingNode.location.lon,
          otherNode.location.lat,
          otherNode.location.lon,
          "K",
        );
      });
    }

    if (toChangeNode.snapshots !== undefined) {
      refNode.snapshots = toChangeNode.snapshots;
      toChangeNode.snapshots.forEach((snapshot) => {
        refNode.links.forEach((id) => {
          const link = data.links.get(id);
          if (link === undefined) return;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { snapshots: linkSnapshots, ...linkWithoutSnapshots } = link;

          const source = data.nodes.get(link.source);
          const target = data.nodes.get(link.target);

          if (source === undefined || target === undefined) return;

          const otherNode = source.id === refNode.id ? target : source;

          const otherNodeSnapshot = otherNode.snapshots.get(
            snapshot.date.getTime(),
          );

          const linkSnapshot = link.snapshots?.get(snapshot.date.getTime());
          let newSnapshot: Types.Snapshot<Link> | undefined = undefined;
          if (linkSnapshot === undefined) {
            let earliestSnapshotDate: number | undefined = undefined;
            let snapshotToUpdate: Types.Snapshot<Link> | undefined = undefined;
            if (link.snapshots !== undefined) {
              earliestSnapshotDate = Math.min(
                ...Array.from(link.snapshots.keys()),
              );

              if (
                earliestSnapshotDate !== undefined &&
                earliestSnapshotDate > snapshot.date.getTime()
              ) {
                return;
              }

              snapshotToUpdate = link.getSnapshot(snapshot.date.getTime());
            }

            if (snapshotToUpdate === undefined) {
              snapshotToUpdate = linkWithoutSnapshots;
            }

            newSnapshot = {
              ...snapshotToUpdate,
              distance: Helpers.distance(
                snapshot.location.lat,
                snapshot.location.lon,
                otherNodeSnapshot !== undefined
                  ? otherNodeSnapshot.location.lat
                  : otherNode.location.lat,
                otherNodeSnapshot !== undefined
                  ? otherNodeSnapshot.location.lon
                  : otherNode.location.lon,
                "K",
              ),
            };
          } else {
            newSnapshot = {
              ...linkSnapshot,
              distance: Helpers.distance(
                snapshot.location.lat,
                snapshot.location.lon,
                otherNodeSnapshot !== undefined
                  ? otherNodeSnapshot.location.lat
                  : otherNode.location.lat,
                otherNodeSnapshot !== undefined
                  ? otherNodeSnapshot.location.lon
                  : otherNode.location.lon,
                "K",
              ),
            };
          }

          link.addSnapshot(newSnapshot);
        });
      });
    }

    return refNode;
  }

  if (type === "link") {
    const refLink = data.links.get(id);
    if (refLink === undefined) return;

    const toChangeLink = toChange as Omit<
      Partial<Link>,
      "id" | "source" | "target"
    >;

    if (toChangeLink.date !== undefined) {
      refLink.date = toChangeLink.date;
    }

    if (toChangeLink.distance !== undefined) {
      refLink.distance = toChangeLink.distance;
    }

    if (toChangeLink.type !== undefined) {
      refLink.type = toChangeLink.type;
    }

    if (toChangeLink.snapshots !== undefined) {
      refLink.snapshots = toChangeLink.snapshots;
    }
  }

  if (type === "type") {
    let refType = data.types.get(id);
    if (refType === undefined) return;

    const toChangeType = toChange as Omit<Partial<Types.Type>, "id">;

    refType = { ...refType, ...toChangeType };
  }
}
