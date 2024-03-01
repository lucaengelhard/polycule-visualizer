import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Alert } from ".";

const ConfirmDialog =
  createContext<(data: alertState) => Promise<boolean>>(null);

type alertState = {
  isOpen?: boolean;
  title: string;
  description: string;
  confirmBtnLabel: string;
};

export function ConfirmDialogProvider({
  children,
}: {
  children: React.JSX.Element;
}) {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    description: "",
    confirmBtnLabel: "",
  });
  const fn = useRef<() => void | null>(null);

  const confirm = useCallback(
    (data: alertState) => {
      return new Promise((resolve) => {
        setState({ ...data, isOpen: true });

        fn.current = (choice: boolean) => {
          resolve(choice);
          setState({
            isOpen: false,
            title: "",
            description: "",
            confirmBtnLabel: "",
          });
        };
      });
    },
    [setState],
  );

  return (
    <ConfirmDialog.Provider value={confirm}>
      {children}
      <Alert
        {...state}
        onClose={() => fn.current !== null && fn.current(false)}
        onConfirm={() => fn.current !== null && fn.current(true)}
      />
    </ConfirmDialog.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default function useConfirm() {
  return useContext(ConfirmDialog);
}
