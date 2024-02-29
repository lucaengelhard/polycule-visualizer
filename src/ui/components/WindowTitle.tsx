import { ReactNode } from "react";

export default function WindowTitle({
  label,
  icon,
}: {
  label?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="pointer-events-auto flex gap-3 font-bold">
      {icon}
      {label}
    </div>
  );
}
