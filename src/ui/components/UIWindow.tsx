import { ReactNode, useContext, useEffect, useState } from "react";
import { Button, WindowTitle } from ".";
import Draggable from "react-draggable";
import { WindowContext } from "..";

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
  const { windowState, setWindowState } = useContext(WindowContext);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Increment count on mount
    setWindowState((prevState) => {
      setId(prevState.count + 1);
      return { ...prevState, count: prevState.count + 1 };
    });
  }, [setWindowState]);

  function setLastWindowState() {
    if (id === undefined) return;
    setWindowState({ ...windowState, last: id });
  }

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
      setLastWindowState();
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
    <div className="pointer-events-auto h-min max-h-screen w-min">
      {open && (
        <Draggable onMouseDown={setLastWindowState}>
          <div
            className={`absolute z-10 h-min w-min cursor-pointer rounded-lg bg-white p-3 shadow-lg ${id === windowState.last && "z-20"}`}
          >
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
