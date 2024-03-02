import { ReactNode, useEffect, useState } from "react";
import { Button, WindowTitle } from ".";
import Draggable from "react-draggable";

export default function UIWindow({
  children,
  header,
  openButton,
  closeButton,
  openCondition,
  closeAction,
  openAction,
}: {
  children: ReactNode;
  header?: { label?: string; icon?: ReactNode };
  openButton?: { label?: string; icon?: ReactNode };
  closeButton?: { label?: string; icon?: ReactNode };
  openCondition?: boolean;
  closeAction?: () => void;
  openAction?: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openCondition !== undefined) {
      setOpen(openCondition);
    }
  }, [openCondition]);

  function toggle() {
    if (open) {
      closeWindow();
    } else {
      openWindow();
    }
  }
  function closeWindow() {
    if (closeAction === undefined) {
      setOpen(false);
    } else {
      closeAction();
    }
  }

  function openWindow() {
    if (openAction === undefined) {
      setOpen(true);
    } else {
      openAction();
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
                  onClick={closeWindow}
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
