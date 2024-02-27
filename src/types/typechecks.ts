import { Relationship } from "../classes/relationship";
import * as Types from "./types";

export function typeCheckPerson(input: unknown): input is Types.Person {
  if (
    (input as Types.Person).id === undefined ||
    (input as Types.Person).name === undefined ||
    (input as Types.Person).location === undefined ||
    (input as Types.Person).relationships === undefined
  ) {
    return false;
  }

  if (
    (input as Types.Person).location.name === undefined ||
    (input as Types.Person).location.lat === undefined ||
    (input as Types.Person).location.lon === undefined
  ) {
    return false;
  }

  return true;
}

export function typeCheckRel(input: unknown): input is Relationship {
  if (
    (input as Relationship).source === undefined ||
    (input as Relationship).target === undefined ||
    (input as Relationship).type === undefined ||
    (input as Relationship).distance === undefined
  ) {
    return false;
  }

  if (!typeCheckRelType((input as Relationship).type)) {
    return false;
  }

  return true;
}

export function typeCheckRelType(input: unknown): input is Types.RelType {
  if (
    (input as Types.RelType).color === undefined ||
    (input as Types.RelType).name === undefined ||
    (input as Types.RelType).id === undefined
  ) {
    return true;
  }

  return false;
}
