"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import {
  Plus,
  TrashIcon,
  Info,
  Users,
  Home,
  Building2,
  Stethoscope,
  GraduationCap,
  Plane,
  CalendarDays,
  Cigarette,
  Briefcase,
  Handshake,
  Check,
} from "lucide-react";
import { useParams } from "next/navigation";

import Panel from "@/components/common/Panel/Panel";
import IconButton from "@/components/common/Buttons/IconButton";
import InputControl from "@/common/components/InputControl";
import { useAppointment } from "@/hooks/client/use-appointment";
import type { Any } from "@/common/types/types";
import PrimaryButton from "@/common/components/PrimaryButton";

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
  general_information: "Algemeen",
  important_contacts: "Belangrijke contacten",
  household_info: "Huishouden",
  organization_agreements: "Organisatie­afspraken",
  treatment_agreements: "Behandel­afspraken",
  school_internship: "School­stage",
  travel: "Reizen",
  leave: "Verlof",
  smoking_rules: "Rook­beleid",
  work: "Werk",
  youth_officer_agreements: "Jeugd­ambtenaar",
};

const sectionIcons: Record<string, LucideIcon> = {
  general_information: Info,
  important_contacts: Users,
  household_info: Home,
  organization_agreements: Building2,
  treatment_agreements: Stethoscope,
  school_internship: GraduationCap,
  travel: Plane,
  leave: CalendarDays,
  smoking_rules: Cigarette,
  work: Briefcase,
  youth_officer_agreements: Handshake,
};

interface FieldArraySectionProps {
  name: string;
  control: any;
  register: any;
  title: string;
  Icon: LucideIcon;
}

const FieldArraySection: React.FC<FieldArraySectionProps> = ({
  name,
  control,
  register,
  title,
  Icon,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <section className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-xs hover:shadow-sm transition p-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
          <Icon className="w-4 h-4 text-blue-600" />
        </span>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="space-y-4">
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-3 group"
            >
              <InputControl
                {...register(`${name}.${index}.content` as const)}
                className="flex-1 px-4 py-2  border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition border-none"
              />

              <IconButton
                buttonType="Danger"
                onClick={() => remove(index)}
                className="opacity-70 group-hover:opacity-100 transition h-[42px] w-[42px] flex items-center justify-center"
              >
                <TrashIcon className="w-4 h-4 text-white" />
              </IconButton>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">Nog geen items</p>
        )}
      </div>

      <PrimaryButton
        text="Item toevoegen"
        icon={Plus}
        type="button"
        onClick={() => append({ content: "" })}
        className="mt-6 w-full flex bg-white items-center justify-center gap-2 rounded-md border border-blue-500 text-blue-700 font-semibold py-3 hover:bg-blue-50 hover:text-blue-700 transition"
        animation="none"
        iconSide="left"
      />
    </section>
  );
};

export default function AppointmentCardEditPage() {
  const params = useParams();
  const clientId = params?.clientId?.toString() || "0";

  const { appointments, createAppointment, updateAppointment } = useAppointment(clientId);
  const appointmentData = appointments || defaultAppointment;
  const keysToExclude = ["id", "client_id", "created_at", "updated_at"];

  const formDefaultValues = useMemo(() => {
    return Object.keys(appointmentData).reduce((acc, key) => {
      if (keysToExclude.includes(key)) return acc;
      const value = (appointmentData as any)[key];
      acc[key] = Array.isArray(value)
        ? value.map((item: string) => ({ content: item }))
        : value;
      return acc;
    }, {} as Record<string, Any>);
  }, [appointmentData]);

  const methods = useForm({ defaultValues: formDefaultValues });
  const { handleSubmit, control, register, reset } = methods;

  useEffect(() => {
    reset(formDefaultValues);
  }, [formDefaultValues, reset]);

  const onSubmit = (data: Any) => {
    const transformed: typeof appointmentData = Object.keys(data).reduce(
      (acc, key) => {
        const val = (data as any)[key];
        acc[key as keyof typeof appointmentData] = Array.isArray(val)
          ? val.map((i: any) => i.content || "")
          : val;
        return acc;
      },
      {} as typeof appointmentData
    );
    appointments
      ? updateAppointment(transformed)
      : createAppointment(transformed);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel
          title="Afspraak Bewerken"
          sideActions={
            <>
              <PrimaryButton
                text="Opslaan"
                icon={Check}
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md focus:ring-4 focus:ring-blue-200 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02]"
                animation="animate-bounce"
              />
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-50/60">
            {Object.keys(formDefaultValues).map((key) => (
              <FieldArraySection
                key={key}
                name={key}
                control={control}
                register={register}
                title={translationMap[key] || key.replace(/_/g, " ")}
                Icon={sectionIcons[key] || Info}
              />
            ))}
          </div>
        </Panel>
      </form>
    </FormProvider>
  );
}