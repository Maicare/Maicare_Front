"use client";

import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { ModalProps } from "@/types/modal-props.types";

interface ModalContextType {
  OpenedModal: FunctionComponent<ModalProps> | null;
  modals: FunctionComponent<ModalProps>[];
  push: (modal: FunctionComponent<ModalProps>) => void;
  pop: () => void;
  removeModal: (modal: FunctionComponent<ModalProps>) => void;
}

const ModalContext = React.createContext<ModalContextType>({
  OpenedModal: null,
  modals: [],
  push: () => {},
  pop: () => {},
  removeModal: () => {},
});

const ModalProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const [OpenedModal, setOpenedModal] =
    useState<FunctionComponent<ModalProps> | null>(null);
  const [modals, setModals] = useState<FunctionComponent<ModalProps>[]>([]);

  const push = useCallback(
    (modal: FunctionComponent<ModalProps>) => {
      setModals((prevModals) => [...prevModals, modal]);
      setOpenedModal(() => modal);
    },
    [setModals, setOpenedModal]
  );

  const pop = useCallback(() => {
    setModals((prevModals) => {
      const newModals = prevModals.slice(0, prevModals.length - 1);
      if (newModals.length > 0) {
        setOpenedModal(() => newModals[newModals.length - 1]);
      } else {
        setOpenedModal(null);
      }
      return newModals;
    });
  }, [setModals, setOpenedModal]);

  const removeModal = useCallback(
    (modal: FunctionComponent<ModalProps>) => {
      setModals((prevModals) => {
        const newModals = prevModals.filter((m) => m !== modal);
        if (newModals.length > 0) {
          setOpenedModal(() => newModals[newModals.length - 1]);
        } else {
          setOpenedModal(null);
        }
        return newModals;
      });
    },
    [setModals, setOpenedModal]
  );

  return (
    <ModalContext.Provider
      value={{
        OpenedModal,
        modals,
        push,
        pop,
        removeModal,
      }}
    >
      <>
        {props.children}
        {OpenedModal && <OpenedModal open={true} onClose={pop} />}
      </>
    </ModalContext.Provider>
  );
};

export default ModalProvider;

export function useModal(Modal: FunctionComponent<ModalProps>) {
  const { push, removeModal, pop } = useContext(ModalContext);

  return {
    open: (additionalProps: { [key: string]: any }) => {
      const Component: FunctionComponent<ModalProps> = (props) => (
        <Modal {...props} additionalProps={additionalProps} />
      );
      push(Component);
      return () => removeModal(Component);
    },
    close: () => {
      pop();
    },
  };
}
