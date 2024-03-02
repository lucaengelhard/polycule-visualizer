import { ReactNode, useState } from "react";
import { Button, WindowTitle } from ".";
import Draggable from "react-draggable";

export default function UIWindow({
  children,
  header,
  openButton,
  closeButton,
}: {
  children: ReactNode;
  header?: { label?: string; icon?: ReactNode };
  openButton?: { label?: string; icon?: ReactNode };
  closeButton?: { label?: string; icon?: ReactNode };
}) {
  const [open, setOpen] = useState(false);

  function toggle() {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }

  return (
    <div className="h-min w-min">
      {open && (
        <Draggable>
          <div className="absolute z-10 h-min w-min cursor-pointer rounded-lg bg-white p-3 shadow-lg">
            <WindowTitle label={header?.label} icon={header?.icon} />
            {children}
            {closeButton && (
              <div className="mt-2">
                <Button
                  label={closeButton.label}
                  icon={closeButton.icon}
                  onClick={() => setOpen(false)}
                  type="deny"
                />
              </div>
            )}
          </div>
        </Draggable>
      )}
      {openButton && (
        <Button
          label={openButton.label}
          icon={openButton.icon}
          onClick={toggle}
        />
      )}
    </div>
  );
}
