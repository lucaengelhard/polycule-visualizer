import { useRef } from "react";

export default function Graph() {
  const canvas = useRef(null);
  return <svg ref={canvas}></svg>;
}
