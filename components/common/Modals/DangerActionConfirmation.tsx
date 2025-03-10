import React, { FunctionComponent } from "react";
import { ModalProps } from "@/common/types/modal-props.types";
import WarningModal from "@/components/common/Modals/WarningModal";

type ConfigProps = {
  msg: string;
  title: string;
};

type AllProps = ConfigProps & ModalProps;

const DangerActionConfirmation: FunctionComponent<AllProps> = ({
  open,
  onClose,
  msg,
  title,
  additionalProps,
}) => {
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
};

export default DangerActionConfirmation;

export function getDangerActionConfirmationModal(props: ConfigProps) {
  const DangerComponent: FunctionComponent<ModalProps> = (modalProps) => (
    <DangerActionConfirmation {...modalProps} {...props} />
  );
  DangerComponent.displayName = "DangerActionConfirmationModal";
  return DangerComponent;
}
