import React, { FunctionComponent } from "react";
import FormModal from "./FormModal";
// import ContactForm from "@/components/contacts/ContactForm";
import { ModalProps } from "@/common/types/modal.types";

const ClientUpsertContactModal: FunctionComponent<ModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <FormModal open={open} onClose={onClose} title={"Maak een nieuwe opdrachtgever aan"}>

    </FormModal>
  );
};

export default ClientUpsertContactModal;
