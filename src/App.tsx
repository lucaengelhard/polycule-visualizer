import { useState } from "react";
import Graph from "./graph/Graph";
import UI from "./ui/UI";
import * as Types from "./types/types";
import { graph } from "./db/db";

export default function App() {
  const [graphState, setGraphState] = useState<Types.DBData>(graph);
  /*
  setTimeout(() => {
    const newPerson: Types.GraphNode = {
      name: "test",
      id: graphState.nodes.length,
      location: {
        name: "Hinterdupfingen",
        lat: 47.994517,
        lon: 8.248138,
      },
      relationships: [],
    };
    setGraphState({ ...graphState, nodes: [...graphState.nodes, newPerson] });
  }, 3000);*/

  return (
    <>
      <UI />
      <Graph graph={graphState} />
    </>
  );
}
