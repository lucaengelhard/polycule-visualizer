import { useContext, useEffect, useRef, useState } from "react";
import { DBContext, EditContext } from "../../App";
import * as Types from "../../types";
import { distanceScale } from "../../utils/helpers";
import { ForceGraph2D } from "react-force-graph";

import Link from "../../classes/link";

type GraphNode = Omit<Types.Node, "id"> & {
  id: string;
};

type GraphLink = Omit<Omit<Link, "source">, "target"> & {
  source: string;
  target: string;
};

type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

export default function Graph() {
  const { DBState } = useContext(DBContext);
  const { setEditState } = useContext(EditContext);
  const graphRef = useRef();

  const [graphData, setGraphData] = useState<GraphData>();

  useEffect(() => {
    const d3ForceLink = graphRef.current.d3Force("link");

    if (d3ForceLink) {
      d3ForceLink.distance((link) => distanceScale(link.distance));
    }
  }, []);

  useEffect(() => {
    const nodes: GraphNode[] = Object.values(DBState.nodes).map((node) => {
      return {
        ...node,
        id: node.id.toString(),
      };
    });
    const links: GraphLink[] = Object.values(DBState.links).map((link) => {
      return {
        ...link,
        source: link.source.id.toString(),
        target: link.target.id.toString(),
      };
    });
    setGraphData({ nodes: nodes, links: links });
  }, [DBState.links, DBState.nodes]);

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={graphData}
      nodeRelSize={10}
      nodeColor={() => "#000000"}
      onNodeClick={(node) =>
        setEditState({ node: parseInt(node.id), link: undefined })
      }
      linkColor={(link) => link.type.color}
      linkWidth={3}
      onLinkClick={(link) => setEditState({ node: undefined, link: link.id })}
      cooldownTicks={100}
      onEngineStop={() => graphRef.current.zoomToFit(400, 100)}
    />
  );
}
