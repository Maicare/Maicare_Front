import React, { FunctionComponent } from "react";
import { ModalProps } from "@/common/types/modal-props.types";
import WarningModal from "@/components/common/Modals/WarningModal";

type ConfigProps = {
  msg: string|React.FC;
  title: string;
};

type WarningActionConfirmationProps = ConfigProps & ModalProps;

export default function WarningActionConfirmation({
  open,
  onClose,
  msg:Msg,
  title,
  additionalProps,
}: WarningActionConfirmationProps) {
  return (
    <WarningModal
      open={open}
      onClose={onClose}
      modalTitle={title}
      onCancel={additionalProps?.onCancel}
      onConfirm={additionalProps?.onConfirm}
    >
      {
        typeof Msg === "string" && <p>{Msg}</p> 
      }
      {
        typeof Msg === "function" && <Msg />
      }
    </WarningModal>
  );
}

export function getWarningActionConfirmationModal(props: ConfigProps) {
  const WarningComponent: FunctionComponent<ModalProps> = (modalProps) => (
    <WarningActionConfirmation {...modalProps} {...props} />
  );
  WarningComponent.displayName = "WarningActionConfirmationModal";
  return WarningComponent;
}
