import { ReactNode } from "react";

export default function WindowTitle({
  label,
  icon,
}: {
  label?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="pointer-events-auto flex gap-3 whitespace-nowrap font-bold">
      {icon}
      {label}
    </div>
  );
}
