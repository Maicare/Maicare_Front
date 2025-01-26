import React, { FunctionComponent } from "react";
import WarningIcon from "@/components/icons/WarningIcon";
import Button from "../Buttons/Button";
import TextareaControlled from "../FormFields/TextareaControlled";
import FormModal from "./FormModal";
import { ModalProps } from "@/common/types/modal.types";
import InputControl from "@/common/components/InputControl";
import { useForm, FormProvider } from "react-hook-form";
import { DepartureEntries } from "@/types/contracts.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientTerminationform } from "@/schemas/client.schema";

const TerminationModal: FunctionComponent<ModalProps> = ({ additionalProps, ...props }) => {
  const initialValues = {
    departure_reason: "",
    departure_report: "",
  };

  const methods = useForm<DepartureEntries>({
    resolver: yupResolver(ClientTerminationform),
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;


  const onSubmit = async (data: DepartureEntries) => {
    console.log("TERMINATING CLIENT.", data);
  };

  return (
    <FormModal {...props} title={additionalProps?.title ?? "Cliëntdossier beëindigen"}>
      <p className="mb-6 bg-meta-8/20 p-4 rounded-xl text-slate-800  dark:text-white">
        <WarningIcon className="inline" />{" "}
        {additionalProps?.msg ??
          "Weet u zeker dat u de status van deze cliënt wilt wijzigen in 'Uit zorg'? bevestigen door een afsluitend rapport in te dienen."}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputControl
            type="text"
            label={"Reden van beëindiging"}
            placeholder={"Reden van beëindiging"}
            id="departure_reason"
            name="departure_reason"
            className="mb-4"
            required={true}
          />
          <TextareaControlled
            label={"Afsluitend rapport"}
            placeholder={"Afsluitend rapport"}
            id="departure_report"
            name="departure_report"
            required={true}
            rows={6}
            className="w-full mb-6"
          />
          <div className="flex justify-center gap-4 items-center">
            <Button buttonType={"Outline"} onClick={props.onClose}>
              Annuleren
            </Button>
            <Button isLoading={isSubmitting} type="submit">Bevestigen</Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
};

export default TerminationModal;
