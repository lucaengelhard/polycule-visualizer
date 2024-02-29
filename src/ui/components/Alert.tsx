import { Ban, Trash2 } from "lucide-react";
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
        <div>
          <div>{title}</div>
          <div>{description}</div>
          <div>
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
      )}
    </>
  );
}
