"use client";

import React, { FunctionComponent } from "react";
import WarningIcon from "@/components/icons/WarningIcon";
import Button from "../Buttons/Button";
import TextareaControlled from "../FormFields/TextareaControlled";
import FormModal from "./FormModal";
import { ModalProps } from "@/common/types/modal.types";
import InputControl from "@/common/components/InputControl";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { DepartureEntries } from "@/types/contracts.types";
// import { ClientTerminationform } from "@/schemas/client.schema";
import { STATUS_OPTIONS } from "@/consts";
import SelectControlled from "@/common/components/SelectControlled";
import ControlledCheckboxItem from "@/common/components/ControlledCheckboxItem";
import { useClient } from "@/hooks/client/use-client";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";

const TerminationModal: FunctionComponent<ModalProps> = ({ additionalProps, ...props }) => {
  const params = useParams();
  const clientId = params?.clientId ? params?.clientId?.toString() : "0";
  const { updateStatus } = useClient({});

  const initialValues = {
    status: additionalProps?.status ?? "",
    schedueled: false,
    schedueled_for: "",
    reason: "",
  };

  const methods = useForm<DepartureEntries>({
    // resolver: yupResolver(ClientTerminationform),
    defaultValues: initialValues,
  });

  // Watch the "schedueled" field
  const isSchedueled = useWatch({
    control: methods.control,
    name: "schedueled",
    defaultValue: false,
  });

  // Watch the "status" field
  const statusValue = useWatch({
    control: methods.control,
    name: "status",
    defaultValue: additionalProps?.status ?? "",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: DepartureEntries) => {
    try {
      const updatePayload = {
        ...data,
        schedueled_for: data.schedueled_for ? dayjs(data.schedueled_for).toISOString() : dayjs().toISOString(),

      };
      await updateStatus(clientId, updatePayload);
      if (additionalProps?.onStatusUpdate) {
        additionalProps.onStatusUpdate(data.status);
      }
      props.onClose();
    } catch (error) {
      enqueueSnackbar("Failed to update Status ", { variant: "error" });
      console.log(error)
    }
  };

  return (
    <FormModal {...props} title={additionalProps?.title ?? "Cliëntdossier beëindigen"}>
      {statusValue === "Out Of Care" && (
        <p className="mb-6 bg-meta-8/20 p-4 rounded-xl text-slate-800 dark:text-white">
          <WarningIcon className="inline" />{" "}
          {additionalProps?.msg ??
            "Weet u zeker dat u de status van deze cliënt wilt wijzigen naar 'Uit zorg'? Dit kan niet ongedaan worden gemaakt."}
        </p>
      )}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SelectControlled
            label="Nieuwe status"
            id="status"
            name="status"
            options={STATUS_OPTIONS}
            className="mb-4"
            required={true}
          />
          <ControlledCheckboxItem
            name="schedueled"
            id="schedueled"
            className="w-full mb-4"
            label="Plan de update"
          />
          {isSchedueled && (
            <InputControl
              name="schedueled_for"
              id="schedueled_for"
              className="w-full mb-4"
              label="Geplande datum"
              type="date"
            />
          )}
          <TextareaControlled
            label="Reden"
            placeholder="Voer de reden in"
            id="reason"
            name="reason"
            required={true}
            rows={6}
            className="w-full mb-6"
          />
          <div className="flex justify-center gap-4 items-center">
            <Button buttonType="Outline" onClick={props.onClose}>
              Annuleren
            </Button>
            <Button isLoading={isSubmitting} type="submit">
              Bevestigen
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
};

export default TerminationModal;