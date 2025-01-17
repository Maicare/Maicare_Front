import React, { FunctionComponent } from "react";
import { ModalProps } from "@/common/types/modal-props.types";
import WarningModal from "@/components/common/Modals/WarningModal";

type ConfigProps = {
  msg: string;
  title: string;
};

type WarningActionConfirmationProps = ConfigProps & ModalProps;

export default function WarningActionConfirmation({
  open,
  onClose,
  msg,
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
      <p>{msg}</p>
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
