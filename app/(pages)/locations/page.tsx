"use client";

import React, { FunctionComponent, useMemo, useEffect } from "react";

import Panel from "@/components/common/Panel/Panel";
import { ColumnDef } from "@tanstack/react-table";
import Loader from "@/components/common/loader";
import Table from "@/components/common/Table/Table";
import Button from "@/components/common/Buttons/Button";
import FormModal from "@/components/common/Modals/FormModal";
import IconButton from "@/components/common/Buttons/IconButton";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import Textarea from "@/components/common/FormFields/Textarea";
import InputField from "@/components/common/FormFields/InputField";
import { useModal } from "@/components/providers/ModalProvider";
import XMarkIcon from "@/components/icons/XMarkIcon";

import { ModalProps } from "@/common/types/modal-props.types";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation } from "@/hooks/location/use-location";
import { CreateLocationReqDto, Location } from "@/types/location.types";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import { PermissionsObjects } from "@/common/data/permission.data";

type FormValues = CreateLocationReqDto;

const initialValues: CreateLocationReqDto = {
  name: "",
  address: "",
  capacity: 0,
};

const validationSchema: yup.ObjectSchema<CreateLocationReqDto> = yup.object({
  name: yup.string().required("Naam is verplicht"),
  address: yup.string().required("Adres is verplicht"),
  capacity: yup
    .number()
    .required("Capaciteit is verplicht")
    .positive("Capaciteit moet positief zijn"),
});

const LocationFormModal: FunctionComponent<ModalProps> = ({
  onClose,
  open,
  additionalProps,
}) => {
  const { getLocation, modifyLocation, addLocation } = useLocation();
  const isEditMode = additionalProps?.mode === "edit" && additionalProps?.id;

  const { data: initialData, isLoading: isFetching } = isEditMode
    ? getLocation(additionalProps.id)
    : { data: initialValues, isLoading: false };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialData ?? initialValues,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (isEditMode) {
      await modifyLocation(additionalProps.id, values);
    } else {
      await addLocation(values);
    }
    onClose();
  };

  useEffect(() => {
    reset(initialData ?? initialValues);
  }, [reset, initialData]);

  return (
    <FormModal open={open} onClose={onClose} title={"Nieuwe locatie"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          className={"mb-4"}
          label={"Naam"}
          required={true}
          {...register("name")}
          error={errors.name?.message}
          placeholder={"Naam"}
        />
        <InputField
          className={"mb-4"}
          label={"Capaciteit"}
          type={"number"}
          required={true}
          {...register("capacity")}
          error={errors.capacity?.message}
          placeholder={"Capaciteit"}
        />
        <Textarea
          className={"mb-6"}
          label={"Adres"}
          required={true}
          rows={6}
          {...register("address")}
          error={errors.address?.message}
          placeholder={"Adres"}
        />
        <Button
          type={"submit"}
          isLoading={isSubmitting || isFetching}
          disabled={isSubmitting || isFetching}
          formNoValidate={true}
        >
          Opslaan
        </Button>
      </form>
    </FormModal>
  );
};

const Page: FunctionComponent = () => {
  const { open } = useModal(LocationFormModal);
  return (
    <Panel
      title={"Locaties"}
      sideActions={
        <Button
          onClick={() => {
            open({});
          }}
        >
          Nieuwe locatie
        </Button>
      }
    >
      <LocationsList />
    </Panel>
  );
};

const LocationsList = () => {
  const { locations, isLoading, deleteLocation } = useLocation();

  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet je zeker dat je deze locatie wilt verwijderen?",
      title: "Locatie Verwijderen",
    })
  );
  const { open: openLocationFormModal } = useModal(LocationFormModal);
  const columnDefs = useMemo<ColumnDef<Location>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Naam",
      },
      {
        accessorKey: "address",
        header: "Adres",
      },
      {
        accessorKey: "capacity",
        header: "Capaciteit",
      },
      {
        id: "actions",
        cell: (info) => {
          return (
            <div className="flex justify-end mr-4">
              <IconButton
                buttonType={"Danger"}
                onClick={(e) => {
                  e.stopPropagation();
                  open({
                    onConfirm: () => {
                      deleteLocation(info.row.original.id);
                    },
                  });
                }}
              >
                <XMarkIcon className="w-5 h-5" />
              </IconButton>
            </div>
          );
        },
      },
    ];
  }, [open, deleteLocation]);

  if (isLoading) {
    return <Loader />;
  }

  if (!locations) {
    return null;
  }
  return (
    <Table
      data={locations}
      columns={columnDefs}
      onRowClick={(locationItem) => {
        openLocationFormModal({ id: locationItem.id, mode: "edit" });
      }}
    />
  );
};

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewLocation,
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
