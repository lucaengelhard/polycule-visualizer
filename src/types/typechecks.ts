import Link from "../classes/link";
import * as Types from "./types";

export function typeCheckNode(input: unknown): input is Types.Node {
  if (
    (input as Types.Node).id === undefined ||
    (input as Types.Node).name === undefined ||
    (input as Types.Node).location === undefined ||
    (input as Types.Node).relationships === undefined
  ) {
    return false;
  }

  if (
    (input as Types.Node).location.name === undefined ||
    (input as Types.Node).location.lat === undefined ||
    (input as Types.Node).location.lon === undefined
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
    (input as Link).distance === undefined
  ) {
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
    return true;
  }

  return false;
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
