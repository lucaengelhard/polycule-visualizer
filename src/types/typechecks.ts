import Link from "../classes/link";
import * as Types from "./types";

export function typeCheckNode(input: unknown): input is Types.Node {
  if (
    (input as Types.Node).id === undefined ||
    (input as Types.Node).name === undefined ||
    (input as Types.Node).location === undefined ||
    (input as Types.Node).links === undefined ||
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
    typeof (input as Types.Node).links !== "object" ||
    typeof (input as Types.Node).location.name !== "string" ||
    typeof (input as Types.Node).location.lat !== "string" ||
    typeof (input as Types.Node).location.lon !== "string"
  ) {
    return false;
  }

  return true;
}

export function typeCheckLink(input: unknown): input is Link {
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
    typeof (input as Link).source !== "object" ||
    typeof (input as Link).target !== "object" ||
    typeof (input as Link).type !== "object" ||
    typeof (input as Link).distance !== "number" ||
    typeof (input as Link).id !== "number"
  ) {
    return false;
  }

  if (!typeCheckNode((input as Link).source)) {
    return false;
  }

  if (!typeCheckNode((input as Link).target)) {
    return false;
  }

  if (!typeCheckLinkType((input as Link).type)) {
    return false;
  }

  return true;
}

export function typeCheckLinkType(input: unknown): input is Types.LinkType {
  if (
    (input as Types.LinkType).color === undefined ||
    (input as Types.LinkType).name === undefined ||
    (input as Types.LinkType).id === undefined
  ) {
    return false;
  }

  if (
    typeof (input as Types.LinkType).color !== "string" ||
    typeof (input as Types.LinkType).name !== "string" ||
    typeof (input as Types.LinkType).id !== "number"
  ) {
    return false;
  }

  return true;
}

export function checkGraphDataType(input: unknown): input is Types.DBData {
  if ((input as Types.DBData).links === undefined) {
    return false;
  }

  if (Object.keys((input as Types.DBData).links).length > 0) {
    if (!typeCheckLink((input as Types.DBData).links)) {
      return false;
    }
  }

  if ((input as Types.DBData).nodes === undefined) {
    return false;
  }

  if (Object.keys((input as Types.DBData).nodes).length > 0) {
    if (!typeCheckNode((input as Types.DBData).nodes)) {
      return false;
    }
  }

  return true;
}
