import { useRef, useState } from "react";
import WinBox from "react-winbox";

export default function NodeInfo() {
  const [height, setHeight] = useState(100);
  const body = useRef<HTMLDivElement>(null);

  setTimeout(() => {
    if (body.current !== null) {
      setHeight(body.current.clientHeight + 36);
    }
  }, 100);

  return (
    <WinBox
      height={height}
      title="Person"
      x={"center"}
      y={"center"}
      noResize
      noFull
      noMax
    >
      <div ref={body}></div>
    </WinBox>
  );
}
