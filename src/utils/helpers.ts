import { db } from "../db";

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
    return dist;
  }
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function distanceScale(input: number) {
  const distanceArray = Object.values(db.links).map((link) => link.distance);

  return mapRange(input, 0, Math.max(...distanceArray), 100, 500);
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

export function getNewIndex(input: object): number {
  let index = Object.keys(input).length;
  let checked = false;
  while (!checked) {
    if (index in input) {
      index++;
    } else {
      checked = true;
    }
  }

  return index;
}

type NestedObject = {
  [key: string]: unknown;
};

export function transformSetsToArray(input: unknown): unknown {
  if (input instanceof Set) {
    // If it's a Set, convert it to an array
    return Array.from(input).map(transformSetsToArray);
  } else if (Array.isArray(input)) {
    // If it's an array, recursively transform each element
    return input.map(transformSetsToArray);
  } else if (typeof input === "object" && input !== null) {
    // If it's an object, recursively transform each value
    const transformedObject: NestedObject = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        transformedObject[key] = transformSetsToArray(input[key]);
      }
    }
    return transformedObject;
  }

  // Base case: return unchanged for non-object, non-array, non-Set values
  return input;
}

export function bufferTimeCalculator(
  lastDate: Date,
  bufferTime: number,
): boolean {
  return Date.now() - lastDate.getTime() < bufferTime;
}

type NumberKeyObject<T> = {
  [key: number]: T; // Replace 'any' with the type of values in your object
};

export function convertObjectToNumberArray<T>(
  obj: NumberKeyObject<T>,
  placeholder: T,
): T[] {
  const keys = Object.keys(obj)
    .map(Number)
    .sort((a, b) => a - b);

  if (keys.length === 0) return [];

  const resultArray = Array(keys[keys.length - 1] + 1); // Create an array with enough space

  keys.forEach((key) => {
    resultArray[key] = obj[key];
  });

  for (let i = 0; i < resultArray.length; i++) {
    const element = resultArray[i];
    if (element === undefined) {
      resultArray[i] = placeholder;
    }
  }

  return resultArray;
}
