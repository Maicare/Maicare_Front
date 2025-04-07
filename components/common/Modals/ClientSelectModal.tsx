import React, { FunctionComponent } from "react";
import { useForm, Controller } from "react-hook-form";
import ClientSelector from "@/components/ClientSelector/ClientSelector";
import Button from "../Buttons/Button";
import { ModalProps } from "@/common/types/modal-props.types";
import FormModal from "./FormModal";

interface FormValues {
  client: string;
}

const ClientSelectModal: FunctionComponent<ModalProps> = ({ open, onClose, additionalProps }) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { client: "" },
  });

  const onSubmit = (data: FormValues) => {
    additionalProps?.onSelect?.(data.client.toString());
    onClose();
  };

  return (
    <FormModal panelClassName="min-h-100" open={open} onClose={onClose} title="Selecteer een Cliënt">
      <form className="flex flex-col grow" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="client"
          control={control}
          render={({ field }) => (
            <ClientSelector {...field} className="mb-5" />
          )}
        />
        <Button className="mt-auto" type="submit">
          Selecteer Cliënt
        </Button>
      </form>
    </FormModal>
  );
};

export default ClientSelectModal;