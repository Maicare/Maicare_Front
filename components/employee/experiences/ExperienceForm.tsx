import React, { FunctionComponent, useEffect, useState } from "react";
import * as Yup from "yup";
import { FormProps } from "@/types/form-props";
import { CreateExperience, Experience, initialValues } from "@/types/experience.types";
import { useExperience } from "@/hooks/experience/use-experience";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputControl from "@/common/components/InputControl";
import Button from "@/components/common/Buttons/Button";
import Textarea from "@/components/common/FormFields/Textarea";
import TextareaControlled from "@/components/common/FormFields/TextareaControlled";
type Props = FormProps<Experience | undefined> & {
  employeeId: number;
};

const experienceSchema: Yup.ObjectSchema<CreateExperience> = Yup.object({
  job_title: Yup.string().required("Functietitel is vereist"),
  company_name: Yup.string().required("Bedrijfsnaam is vereist"),
  start_date: Yup.string().required("Startdatum is vereist"),
  end_date: Yup.string().required("Einddatum is vereist"),
  description: Yup.string().required("Beschrijving is vereist"),
  employee_id: Yup.number().required("Beschrijving is vereist").default(0)
});

const ExperienceForm: FunctionComponent<Props> = ({
  mode = "add",
  onSuccess,
  employeeId,
  initialData,
}) => {
  const { createOne, updateOne } = useExperience({ autoFetch: false, employeeId: employeeId.toString() });
  const [loading, setLoading] = useState(false);
  async function onSubmit(value: CreateExperience) {
    if (mode === "add") {
      try {
        setLoading(true);
        await createOne(
          {
            ...value,
            employee_id: employeeId,
          }
        );
        onSuccess?.();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else if (mode === "update" && initialData) {
      setLoading(true);
      try {
        setLoading(true);
        await updateOne(
          {
            ...value,
            start_date: value.start_date.split("T")[0],
            end_date: value.end_date.split("T")[0],
            employee_id: employeeId,
            id: initialData.id,
          }
        );
        onSuccess?.();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

    }
  }
  const methods = useForm<CreateExperience>({
    resolver: yupResolver(experienceSchema) as Resolver<CreateExperience>,
    defaultValues: initialData ?? initialValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset
  } = methods;
  console.log(errors)
  useEffect(() => {
    if (employeeId && initialData) {
      reset({
        ...initialData,
        start_date: initialData.start_date.split("T")[0],
        end_date: initialData.end_date.split("T")[0],
      });
    }
  }, [loading, reset, initialData, employeeId]);
  return (
    <FormProvider {...methods}>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <InputControl
            className="w-full xl:w-1/2"
            name="job_title"
            id="job_title"
            label="Functietitel"
            placeholder="Voer de functietitel in"
            type="text"
            required={true}
          />
          <InputControl
            className="w-full xl:w-1/2"
            name="company_name"
            id="company_name"
            label="Bedrijfsnaam"
            placeholder="Voer de bedrijfsnaam in"
            type="text"
            required={true}
          />
        </div>
        <div className="mb-6 flex flex-col gap-6 xl:flex-row">
          <InputControl
            className="w-full xl:w-1/2"
            name="start_date"
            id="start_date"
            label="Startdatum"
            placeholder="Please enter the start date"
            required={true}
            type="date"
          />
          <InputControl
            className="w-full xl:w-1/2"
            name="end_date"
            id="end_date"
            label="Einddatum"
            placeholder="Please enter the end date"
            required={true}
            type="date"
          />
        </div>
        <TextareaControlled
          rows={6}
          name="description"
          id={"description"}
          required={true}
          className={"mb-6"}
          label={"Beschrijving"}
          placeholder={"Voer de beschrijving van de ervaring in"}
        />
        <Button
          type="submit"
          formNoValidate={true}
          isLoading={loading}
          disabled={isSubmitting}
          loadingText={mode === "add" ? "Toevoegen..." : "Bijwerken..."}
        >
          {mode === "add" ? "Opleiding Indienen" : "Opleiding Bijwerken"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default ExperienceForm;
