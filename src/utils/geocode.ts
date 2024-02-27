import { Position } from "../types/types-old";

export async function geoCode(query: string): Promise<Position> {
  const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`;

  const res = await fetch(searchUrl);
  const resObj = await res.json();

  if (resObj[0] === undefined) {
    throw new Error("no adress found");
  }

  return { name: query, lat: resObj[0].lat, lon: resObj[0].lon };
}
