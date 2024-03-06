import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

export default function Alert({
  open,
  onCancel,
  onContinue,
  title,
  children,
}: {
  open: boolean;
  title?: ReactNode;
  children: ReactNode;
  onCancel?: () => void;
  onContinue?: () => void;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {title !== undefined && <AlertDialogTitle>{title}</AlertDialogTitle>}
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {onCancel !== undefined && (
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          )}
          {onContinue !== undefined && (
            <AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
