import { useEffect, useState } from "react";
import Graph from "./graph/Graph";
import UI from "./ui/UI";
import * as Types from "./types/types";
import { graph } from "./db/db";

export default function App() {
  const [graphState, setGraphState] = useState<Types.GraphData>(graph);

  useEffect(() => {
    document.addEventListener("onGraphUpdate", () => {
      setGraphState({
        ...graph,
        links: [...graph.links],
        nodes: [...graph.nodes],
      });
    });
  }, [setGraphState]);

  return (
    <>
      <Graph graph={graphState} />
      <UI />
    </>
  );
}
