import React, { FunctionComponent } from "react";
import FormModal from "./FormModal";
import ContactForm from "@/components/contacts/ContactForm";
import { ModalProps } from "@/common/types/modal.types";

const ClientUpsertContactModal: FunctionComponent<ModalProps> = ({
  open,
  onClose,
  additionalProps,
}) => {
  return (
    <FormModal open={open} onClose={onClose} title={"Maak een nieuwe opdrachtgever aan"}>
      <ContactForm
        onSuccess={() => {
          onClose();
          additionalProps?.onSuccess?.();
        }}
        redirect={false}
      />
    </FormModal>
  );
};

export default ClientUpsertContactModal;
