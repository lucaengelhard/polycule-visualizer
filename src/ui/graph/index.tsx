import { useContext, useEffect, useState } from "react";
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

export default function Graph() {
  const { DBState } = useContext(DBContext);
  const { setEditState } = useContext(EditContext);

  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[];
    links: GraphLink[];
  }>();

  useEffect(() => {
    const nodes = Object.values(DBState.nodes).map((node) => {
      return {
        ...node,
        id: node.id.toString(),
      };
    });
    const links = Object.values(DBState.links).map((link) => {
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
      graphData={graphData}
      nodeColor={() => "#000000"}
      nodeLabel={(node) => node.name}
      onNodeClick={(node) =>
        setEditState({ node: parseInt(node.id), link: undefined })
      }
      linkColor={(link) => link.type.color}
      linkWidth={3}
      onLinkClick={(link) => setEditState({ node: undefined, link: link.id })}
    />
  );
}
