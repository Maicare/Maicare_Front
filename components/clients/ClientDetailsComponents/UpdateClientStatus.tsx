import React, { FunctionComponent, useEffect, useMemo } from "react";
import { FormikProvider, useFormik } from "formik";
import { STATUS_OPTIONS } from "@/consts";
import { useModal } from "@/components/providers/ModalProvider";
import ControlledRadioGroup from "@/common/components/ControlledRadioGroup";
import { DepartureEntries } from "@/types/contracts.types";
import TerminationModal from "../../common/Modals/TerminationModal";
import Button from "../../common/Buttons/Button";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { Client } from "@/types/client.types";
import { ClientUpdateStatus } from "@/schemas/client.schema";
import { yupResolver } from "@hookform/resolvers/yup";

export type statusType = {
  status: string;
};

const UpdateClientStatus: FunctionComponent<{
  client: Client | null;
}> = ({ client }) => {
  const { open: openTerminationModal } = useModal(TerminationModal);

  const methods = useForm<statusType>({
    resolver: yupResolver(ClientUpdateStatus),
    defaultValues: {
      status: client?.status ?? "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
    reset,
  } = methods;

  useEffect(() => {
    if (client) {
      reset({ status: client.status });
    }
  }, [client]);


  // const showTerminationWarning = useMemo(() => {
  //   return values.status === "Out Of Care";
  // }, [values.status]);

  const onSubmit = async (data: statusType) => {

    if (data.status === "Out Of Care") {
      openTerminationModal({});
      console.log("Updating CLIENT TO OUT OF CARE.", data);
    } else {
      console.log("Updating CLIENT.", data);
    }
  };

  if (!client) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ControlledRadioGroup
          options={STATUS_OPTIONS}
          name={"status"}
          className="mb-4"
        />
        {/* {showTerminationWarning  && (
          <div className="text-sm text-c_red p-2">
            <p>
              <WarningIcon className="inline-block" /> Er zijn nog {contracts?.results.length}{" "}
              contracten actief voor deze cliënt. Pas de status van deze contracten aan voordat u de
              status van de cliënt wijzigt.
            </p>
          </div>
        )} */}

        {dirtyFields.status && (
          <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
            Bijwerken
          </Button>
        )}

      </form>
    </FormProvider>
  );
};

export default UpdateClientStatus;
