import Link from "@/classes/link";
import { DB } from "@/db";
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

export function hexToRGBA(hex: string, alpha?: number): string | null {
  if (alpha === undefined) {
    alpha = 1;
  }

  const rgbaRegex =
    /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([01](\.\d+)?)\s*\)/;
  if (rgbaRegex.test(hex)) {
    return hex;
  }

  // Check if the input is a valid hex code
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (!hexRegex.test(hex)) {
    console.error("Invalid hex code");
    return null;
  }

  // Remove the hash symbol if present
  hex = hex.replace(/^#/, "");

  // Convert short hex to full hex (e.g., #abc to #aabbcc)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char.repeat(2))
      .join("");
  }

  // Convert hex to RGBA
  const bigint = parseInt(hex, 16);
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function rgbaStringToHex(rgbaString: string): string | null {
  const rgbaRegex =
    /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([01](\.\d+)?)\s*\)/;

  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (hexRegex.test(rgbaString)) {
    return rgbaString;
  }

  const match = rgbaString.match(rgbaRegex);

  if (!match) {
    console.error("Invalid RGBA string format");
    return null;
  }

  const red = parseInt(match[1], 10);
  const green = parseInt(match[2], 10);
  const blue = parseInt(match[3], 10);

  // Ensure that the values are within the valid range (0-255 for RGB, 0-1 for alpha)
  const validRed = Math.min(255, Math.max(0, red));
  const validGreen = Math.min(255, Math.max(0, green));
  const validBlue = Math.min(255, Math.max(0, blue));

  // Convert RGB to hex
  const rgbHex = ((validRed << 16) | (validGreen << 8) | validBlue)
    .toString(16)
    .padStart(6, "0");

  // Combine RGB and alpha hex values
  const hexColor = `#${rgbHex}`;

  return hexColor;
}

export function distanceScale(input: number) {
  const min = 100;
  if (Number.isNaN(input)) {
    return min;
  }

  return mapRange(input, 0, DB.info.maxDistance, 100, 500);
}

export function mapRange(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number {
  // Ensure the input value is within the source range
  const clampedValue = Math.min(Math.max(value, fromMin), fromMax);

  // Map the value from the source range to the target range
  const mappedValue =
    ((clampedValue - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;

  return mappedValue;
}

export function setMaxDistance() {
  const distanceArray = Array.from(DB.data.links.values()).map(
    (link) => link.distance,
  );

  const max = Math.max(...distanceArray);
  DB.info.maxDistance = max < 100 ? 100 : max;
  return DB.info.maxDistance;
}

export async function geoCode(query: string): Promise<Types.Position> {
  const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`;

  const res = await fetch(searchUrl);
  const resObj = await res.json();

  if (resObj[0] === undefined) {
    throw new Error("no adress found");
  }

  return { name: query, lat: resObj[0].lat, lon: resObj[0].lon };
}
