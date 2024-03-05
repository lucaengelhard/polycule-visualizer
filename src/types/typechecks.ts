import Link from "@/classes/link";
import { Types } from ".";

export function node(input: unknown): input is Types.Node {
  if (typeof input !== "object" || input === null) return false;
  if (
    !(
      "id" in input &&
      "name" in input &&
      "location" in input &&
      "links" in input
    )
  ) {
    return false;
  }

  if (
    input.location === null ||
    input.id === null ||
    input.links === null ||
    input.name === null
  ) {
    return false;
  }

  if (
    input.id === undefined ||
    input.name === undefined ||
    input.location === undefined ||
    input.links === undefined ||
    (input as Types.Node).location.name === undefined ||
    (input as Types.Node).location.lat === undefined ||
    (input as Types.Node).location.lon === undefined
  ) {
    return false;
  }

  if (
    typeof (input as Types.Node).id !== "number" ||
    typeof (input as Types.Node).name !== "string" ||
    typeof (input as Types.Node).location !== "object" ||
    typeof (input as Types.Node).location.name !== "string"
  ) {
    return false;
  }

  return true;
}

export function link(input: unknown): input is Link {
  if (
    (input as Link).source === undefined ||
    (input as Link).target === undefined ||
    (input as Link).type === undefined ||
    (input as Link).distance === undefined ||
    (input as Link).id === undefined
  ) {
    return false;
  }

  if (
    typeof (input as Link).source !== "number" ||
    typeof (input as Link).target !== "number" ||
    typeof (input as Link).type !== "number" ||
    typeof (input as Link).distance !== "number" ||
    typeof (input as Link).id !== "number"
  ) {
    return false;
  }

  return true;
}

export function type(input: unknown): input is Types.Type {
  if (
    (input as Types.Type).color === undefined ||
    (input as Types.Type).name === undefined ||
    (input as Types.Type).id === undefined
  ) {
    return false;
  }

  if (
    typeof (input as Types.Type).color !== "string" ||
    typeof (input as Types.Type).name !== "string" ||
    typeof (input as Types.Type).id !== "number"
  ) {
    return false;
  }

  return true;
}

export function DB(input: unknown): input is Types.DBData {
  if (
    input !== undefined &&
    input !== null &&
    typeof input === "object" &&
    "nodes" in input &&
    "links" in input &&
    "types" in input &&
    input.nodes instanceof Map &&
    input.links instanceof Map &&
    input.types instanceof Map
  ) {
    let nodes = true;
    let links = true;
    let types = true;

    input.nodes.forEach((node) => {
      if (!node(node)) {
        nodes = false;
      }
    });

    input.links.forEach((link) => {
      if (!link(link)) {
        links = false;
      }
    });

    input.types.forEach((type) => {
      if (!type(type)) {
        types = false;
      }
    });

    return nodes && links && types;
  }

  return false;
}
