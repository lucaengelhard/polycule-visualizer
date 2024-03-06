import { useState, useRef, ReactNode } from "react";
import WinBox from "react-winbox";

export default function UIWindow({
  children,
  title,
  x,
  y,
  noResize,
  noFull,
  noMax,
  onClose,
}: {
  children: ReactNode;
  title?: string;
  x?: string | number | undefined;
  y?: string | number | undefined;
  noResize?: boolean | undefined;
  noFull?: boolean | undefined;
  noMax?: boolean | undefined;
  onClose?: ((force: boolean) => boolean | void | undefined) | undefined;
}) {
  const [height, setHeight] = useState(100);
  const body = useRef<HTMLDivElement>(null);

  setTimeout(() => {
    if (body.current !== null) {
      setHeight(body.current.clientHeight + 36);
    }
  }, 100);

  return (
    <WinBox
      title={title}
      height={height}
      x={x ?? "center"}
      y={y ?? "center"}
      noResize={noResize ?? true}
      noFull={noFull ?? true}
      noMax={noMax ?? true}
      onClose={onClose}
    >
      <div ref={body} className="p-3">
        {children}
      </div>
    </WinBox>
  );
}
