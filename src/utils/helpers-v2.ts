import Link from "@/classes/link";
import { Types } from "@/types";

export function findSnapshotIndex(toFind: number, snapshots: number[]): number {
  const earliest = snapshots[0];
  const latest = snapshots.length - 1;

  if (toFind <= earliest) {
    return earliest;
  } else {
    snapshots.shift();
  }

  if (toFind >= latest) {
    return latest;
  } else {
    snapshots.pop();
  }

  if (snapshots.length === 0) return earliest;

  const res = findSnapshotIndex(toFind, snapshots);

  if (res === snapshots[0 + 1]) {
    return snapshots[0];
  } else {
    return res;
  }
}

export function getNewIndex(
  map: Map<number, Types.Node | Types.Type | Link>,
  index?: number,
): number {
  if (index === undefined) {
    index = map.size;
  }

  if (map.has(index)) {
    return getNewIndex(map, index + 1);
  } else {
    return index;
  }
}

export function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: "M" | "K" | "N",
) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    if (dist < 100) {
      dist = 100;
    }

    console.log(dist);

    return dist;
  }
}
