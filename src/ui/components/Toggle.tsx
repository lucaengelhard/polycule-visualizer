import { ReactNode } from "react";

export default function Toggle({
  activeContent,
  inActiveContent,
  active,
  onToggle,
}: {
  activeContent: ReactNode;
  inActiveContent: ReactNode;
  active: boolean;
  onToggle: (active: boolean) => void;
}) {
  function onClick() {
    onToggle(active ? false : true);
  }

  return (
    <button onClick={onClick} className="p-1">
      {active ? activeContent : inActiveContent}
    </button>
  );
}
