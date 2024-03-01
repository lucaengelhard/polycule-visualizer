import { AlertOctagon, Ban, Trash2 } from "lucide-react";
import { Button } from ".";

export default function Alert({
  isOpen,
  onClose,
  title,
  description,
  confirmBtnLabel,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmBtnLabel: string;
  onConfirm: () => void;
}) {
  return (
    <>
      {isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-20 bg-black bg-opacity-60">
          <div className="absolute left-1/2 top-1/2 z-10 h-min w-min -translate-x-1/2 -translate-y-1/2 rounded-lg  bg-red-500 p-3 shadow-xl">
            <div className="flex gap-3 whitespace-nowrap font-bold text-white">
              <AlertOctagon />
              {title}
            </div>
            <div className="mt-2 text-white">{description}</div>
            <div className="mt-3 flex gap-3">
              <Button
                icon={<Trash2 />}
                label={confirmBtnLabel}
                type="confirm"
                onClick={onConfirm}
              />

              <Button
                icon={<Ban />}
                label="Cancel"
                type="deny"
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
