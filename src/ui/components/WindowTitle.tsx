import { ReactNode } from "react";

export default function WindowTitle({
  label,
  icon,
}: {
  label?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex gap-3 font-bold">
      {icon}
      {label}
    </div>
  );
}
