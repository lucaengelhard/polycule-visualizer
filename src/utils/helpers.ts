import { graph } from "../db/db";
import * as Types from "../types/types";

export function hexToRGBA(hex: string, alpha?: number): string | null {
  if (alpha === undefined) {
    alpha = 1;
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

export function findFullSourceTarget(rel: Types.GraphLink) {
  if (typeof rel.source === "number") {
    const fullSource = graph.nodes.find((node) => node.id === rel.source);

    if (!fullSource) {
      throw new Error("No Source Defined");
    }

    rel.source = fullSource;
  }

  if (typeof rel.target === "number") {
    const fullTarget = graph.nodes.find((node) => node.id === rel.target);

    if (!fullTarget) {
      throw new Error("No Source Defined");
    }

    rel.target = fullTarget;
  }

  return rel;
}

export function distanceScale(input: number) {
  const mappedValue = mapRange(input, 0, 500, 0, 1);

  console.log(mappedValue);

  return 1 / (1 + Math.exp(-(mappedValue - 1) * 5));
}

function mapRange(
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
