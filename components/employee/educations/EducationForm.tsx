import React, { FunctionComponent, useEffect, useState } from "react";
import * as Yup from "yup";
import { FormProps } from "@/types/form-props";
import { CreateEducation, Education, initialValues } from "@/types/education.types";
import { useEducation } from "@/hooks/education/use-education";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputControl from "@/common/components/InputControl";
import Button from "@/components/common/Buttons/Button";
type Props = FormProps<Education | undefined> & {
  employeeId: number;
};

const educationSchema: Yup.ObjectSchema<CreateEducation> = Yup.object({
  institution_name: Yup.string().required("Uitgever is vereist"),
  field_of_study: Yup.string().required("Uitgever is vereist"),
  degree: Yup.string().required("Uitgever is vereist"),
  start_date: Yup.string().required("Datum van uitgifte is vereist"),
  end_date: Yup.string().required("Datum van uitgifte is vereist"),
  employee_id: Yup.number().required("Datum van uitgifte is vereist"),

});

const EducationForm: FunctionComponent<Props> = ({
  mode = "add",
  onSuccess,
  employeeId,
  initialData,
}) => {
  const { createOne, updateOne } = useEducation({ autoFetch: false, employeeId: employeeId.toString() });
  const [loading, setLoading] = useState(false);
  async function onSubmit(value: CreateEducation) {
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
  const methods = useForm<CreateEducation>({
    resolver: yupResolver(educationSchema) as Resolver<CreateEducation>,
    defaultValues: initialData ?? initialValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = methods;
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
            name="institution_name"
            id="institution_name"
            label="Naam Instituut"
            placeholder="Voer de naam van de instelling in"
            type="text"
            required={true}
          />
          <InputControl
            className="w-full xl:w-1/2"
            name="degree"
            id="degree"
            label="Diploma"
            placeholder="Voer het diploma in"
            type="text"
            required={true}
          />
        </div>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <InputControl
            className="w-full xl:w-1/2"
            name="field_of_study"
            id="field_of_study"
            label="Studierichting"
            placeholder="Voer de studierichting in"
            type="text"
            required={true}
          />
          <div className="w-full xl:w-1/2" />
        </div>
        <div className="mb-6 flex flex-col gap-6 xl:flex-row">
          <InputControl
            className="w-full xl:w-1/2"
            name="start_date"
            id="start_date"
            label="Startdatum"
            placeholder="Voer de startdatum in"
            required={true}
            type="date"
          />
          <InputControl
            className="w-full xl:w-1/2"
            name="end_date"
            id="end_date"
            label="Einddatum"
            placeholder="Voer de einddatum in"
            required={true}
            type="date"
          />
        </div>
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

export default EducationForm;
