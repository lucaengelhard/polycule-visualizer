import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";

import * as Types from "../types/types";
import { clamp } from "../utils/helpers";

export default function Graph({
  graph,
  setGraphState,
}: {
  graph: Types.GraphData;
  setGraphState: Dispatch<SetStateAction<Types.DBData>>;
}) {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const [simulation, setSimulation] = useState(
    d3
      .forceSimulation(graph.nodes)
      .force(
        "link",
        d3
          .forceLink(graph.links)
          .id((d) => d.id)
          .distance((d) => clamp(d.distance, 0, 500)),
      )
      .force("charge", d3.forceManyBody().strength(-3000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force(
        "radial",
        d3.forceRadial(Math.min(width, height) - 300, width / 2, height / 2),
      ),
  );

  return (
    <svg className="pointer-events-none fixed inset-0 h-screen w-screen">
      <g>
        {graph.links.map((link, index) => {
          const source = graph.nodes.find((node) => {
            if (typeof link.source === "number") {
              return node.id === link.source;
            } else {
              return node.id === link.source.id;
            }
          });

          const target = graph.nodes.find((node) => {
            if (typeof link.target === "number") {
              return node.id === link.target;
            } else {
              return node.id === link.target.id;
            }
          });

          if (source === undefined || target === undefined) {
            return;
          }

          return (
            <GraphLink
              key={index}
              source={source}
              target={target}
              type={link.type}
            />
          );
        })}
      </g>
      <g>
        {graph.nodes.map((node, index) => (
          <GraphNode key={index} node={node} />
        ))}
      </g>
      <g>
        {graph.nodes.map((node, index) => (
          <GraphLabel key={index} node={node} />
        ))}
      </g>
    </svg>
  );
}

function GraphNode({ node }: { node: Types.GraphNode }) {
  function drag(event: React.DragEvent<SVGCircleElement>) {
    console.log(event);
  }

  function click() {
    console.log(node.name);
  }

  return (
    <circle
      r={8}
      cx={node.x}
      cy={node.y}
      onDrag={drag}
      onClick={click}
      className="pointer-events-auto"
    />
  );
}

function GraphLabel({ node }: { node: Types.GraphNode }) {
  return (
    <text fontSize={15} dx={15} dy={4} x={node.x} y={node.y}>
      {node.name}
    </text>
  );
}

function GraphLink({
  source,
  target,
  type,
}: {
  source: Types.GraphNode;
  target: Types.GraphNode;
  type: Types.RelType;
}) {
  return (
    <line
      strokeWidth={3}
      stroke={type.color}
      x1={source.x}
      x2={target.x}
      y1={source.y}
      y2={target.y}
    />
  );
}
