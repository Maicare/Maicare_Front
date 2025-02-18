"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Plus, TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Panel from "@/components/common/Panel/Panel";
import IconButton from "@/components/common/Buttons/IconButton";
import InputControl from "@/common/components/InputControl";
import { useAppointment } from "@/hooks/client/use-appointment";
import { Any } from "@/common/types/types";

const defaultAppointment = {
  general_information: [] as string[],
  household_info: [] as string[],
  important_contacts: [] as string[],
  leave: [] as string[],
  organization_agreements: [] as string[],
  school_internship: [] as string[],
  travel: [] as string[],
  smoking_rules: [] as string[],
  treatment_agreements: [] as string[],
  work: [] as string[],
  youth_officer_agreements: [] as string[],
};

const translationMap: Record<string, string> = {
  general: "Algemeen",
  important_contacts: "Belangrijke contacten",
  household: "Huishouden",
  organization_agreements: "Organisatieafspraken",
  probation_service_agreements: "Afspraken met reclassering",
  appointments_regarding_treatment: "Afspraken betreffende behandeling",
  school_stage: "Schoolfase",
  travel: "Reizen",
  leave: "Verlof",
};

interface FieldArraySectionProps {
  name: string;
  control: any;
  register: any;
  title: string;
}

const FieldArraySection: React.FC<FieldArraySectionProps> = ({
  name,
  control,
  register,
  title,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-600 capitalize">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <tbody>
            {fields.length > 0 ? (
              fields.map((field, index) => (
                <tr key={field.id} className="border-b border-gray-300">
                  <td className="p-2">
                    <InputControl
                      {...register(`${name}.${index}.content` as const)}
                      label=""
                      type="text"
                      className="w-full border-none focus:ring-0 focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 w-20 text-right">
                    <IconButton
                      buttonType="Danger"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </IconButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-300">
                <td className="p-2 text-gray-500" colSpan={2}>
                  -
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="mt-2 text-blue-700 bg-blue-100 dark:bg-gray-800 w-full py-1 px-4 rounded-lg flex justify-center items-center gap-1"
        onClick={() => append({ content: "" })}
      >
        <Plus size={18} /> <span>Item Toevoegen</span>
      </button>
    </div>
  );
};

export default function AppointmentCardEditPage() {
  const params = useParams();
  const clientId = params?.clientId?.toString() || "0";
  const router = useRouter();

  const { appointments, createAppointment, updateAppointment } = useAppointment(clientId);
  // Exclude unwanted keys
  const appointmentData = appointments || defaultAppointment;
  const keysToExclude = ["id", "client_id", "created_at", "updated_at"];

  // Use useMemo so that formDefaultValues only changes when appointmentData changes.
  const formDefaultValues = useMemo(() => {
    return Object.keys(appointmentData).reduce((acc, key) => {
      if (keysToExclude.includes(key)) return acc;
      const value = appointmentData[key as keyof typeof appointmentData];
      if (Array.isArray(value)) {
        acc[key] = value.map((item) => ({ content: item }));
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  }, [appointmentData]);

  console.log("DEFAULT", formDefaultValues);

  const methods = useForm({
    defaultValues: formDefaultValues,
  });
  const { handleSubmit, control, register, reset } = methods;

  // Reset the form when default values change
  useEffect(() => {
    reset(formDefaultValues);
  }, [formDefaultValues]);

  const onSubmit = (data: Any) => {
    // Transform each field array (which is an array of objects with a "content" property)
    // into an array of strings.
    const transformedData = Object.keys(data).reduce((acc, key) => {
      const typedKey = key as keyof typeof appointmentData;
      const value = data[typedKey];
      if (Array.isArray(value)) {
        acc[typedKey] = value.map((item: any) => item.content || "");
      } else {
        acc[typedKey] = value;
      }
      return acc;
    }, {} as typeof appointmentData);

    console.log(transformedData);
    if (appointments)
      updateAppointment(transformedData);
    else
      createAppointment(transformedData);
    // Handle further submission if needed (e.g., API call)
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel
          title="Afspraak Bewerken"
          sideActions={
            <button
              type="submit"
              className="my-4 bg-blue-700 text-white py-2 px-4 rounded-lg float-right"
            >
              Wijzigingen Opslaan
            </button>
          }
        >
          <div className="w-full gap-4 p-4">
            {Object.keys(formDefaultValues).map((key) => (
              <FieldArraySection
                key={key}
                name={key}
                control={control}
                register={register}
                title={translationMap[key] || key.replace(/_/g, " ")}
              />
            ))}
          </div>
        </Panel>
      </form>
    </FormProvider>
  );
}