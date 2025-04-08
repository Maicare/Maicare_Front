import React, { FunctionComponent } from "react";
import Button from "../common/Buttons/Button";
import { CARE_TYPE_OPTIONS, CONTRACT_STATUS_OPTIONS, FINANCING_ACT_TYPES, FINANCING_OPTIONS } from "@/consts";
import { ContractFilterFormType } from "@/types/contracts.types";
import { FormProvider, useForm } from "react-hook-form";
import InputControl from "@/common/components/InputControl";
import { ControlledSelect } from "@/common/components/ControlledSelect";

const ContractFilters: FunctionComponent<{
  onSubmit: (values: ContractFilterFormType) => void;
}> = (props) => {

  const initialValues = {
    search: "",
    status: "",
    care_type: "",
    financing_act: "",
    financing_option: ""
  }

  const methods = useForm<ContractFilterFormType>({
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = methods;

  const handleSubmitCustom = (data: ContractFilterFormType) => {
    props.onSubmit(data);
  };


  return (
    <FormProvider {...methods}>

      <form className="flex flex-wrap items-end gap-4 px-7 py-4" onSubmit={handleSubmit(handleSubmitCustom)}>
        <InputControl
          className="mb-0"
          placeholder="Zoeken"
          name="search"
          label="Zoeken"
          type="text"
        />
        <ControlledSelect
          className=""
          options={CONTRACT_STATUS_OPTIONS}
          name="status"
          label="Status"
        />
        <ControlledSelect
          className=""
          options={CARE_TYPE_OPTIONS}
          name="care_type"
          label="Zorgtype"
        />
        <ControlledSelect
          className=""
          options={FINANCING_ACT_TYPES}
          name="financing_act"
          label="Financieringswet"
        />
        <ControlledSelect
          className=""
          options={FINANCING_OPTIONS}
          name="financing_option"
          label="Financieringsoptie"
        />
        <Button isLoading={isSubmitting} type="submit" className="py-4 ">
          Zoeken
        </Button>
        <Button
          type="button"
          className="py-4 "
          buttonType={"Outline"}
          onClick={(e) => {
            reset(initialValues);
          }}
        >
          Duidelijke Zoek
        </Button>
      </form>
    </FormProvider>
  );
};

export default ContractFilters;
