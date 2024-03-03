import { Types } from "../../types";
import { ReactNode, useEffect, useState } from "react";

export default function Button({
  label,
  icon,
  onClick,
  type,
  additionalClasses,
}: {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  type?: Types.ButtonType;
  additionalClasses?: string;
}) {
  const [conditionalClasses, setConditonalClasses] = useState(
    "outline-offset-0 outline-blue-500 hover:outline",
  );

  useEffect(() => {
    switch (type) {
      case "confirm":
        setConditonalClasses("hover:bg-green-500");
        break;
      case "deny":
        setConditonalClasses("hover:bg-red-500");
        break;
      default:
        setConditonalClasses("outline-offset-0 outline-blue-500 hover:outline");
        break;
    }
  }, [type]);

  return (
    <button
      onClick={onClick}
      className={
        "pointer-events-auto flex h-min w-min gap-3 whitespace-nowrap rounded-lg bg-white p-3 shadow-xl transition-colors " +
        conditionalClasses +
        " " +
        additionalClasses
      }
    >
      {icon}
      {label}
    </button>
  );
}
