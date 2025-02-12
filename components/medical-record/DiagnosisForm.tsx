"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { DiagnosisForm as DiagnosisFormType } from "@/types/diagnosis.types";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import InputControl from "@/common/components/InputControl";
import { ControlledSelect } from "@/common/components/ControlledSelect";
import { DIAGNOSIS_SEVERITY_OPTIONS } from "@/consts";
import TextareaControlled from "../common/FormFields/TextareaControlled";
import Button from "../common/Buttons/Button";
import { useDiagnosis } from "@/hooks/diagnosis/use-diagnosis";
import { DiagnosisFormSchema } from "@/schemas/client.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../common/loader";



type PropsType = {
  clientId: string;
  diagnosisId?: string;
};

const DiagnosisForm: FunctionComponent<PropsType> = ({ diagnosisId, clientId }) => {

  const { createOne, readOne, updateOne } = useDiagnosis(parseInt(clientId));

  const [loading, setLoading] = useState(true)

  const initialValues: DiagnosisFormType = {
    id: 0,
    title: "",
    description: "",
    diagnosis_code: "",
    severity: "",
    status: "",
    notes: "",
  };

  const methods = useForm<DiagnosisFormType>({
    resolver: yupResolver(DiagnosisFormSchema) as Resolver<DiagnosisFormType>,
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = methods;

  useEffect(() => {
    if (diagnosisId) {
      const fetchDiagnosis = async (id: string) => {
        const data = await readOne(id);
        reset(data);
        setLoading(false)
      }
      fetchDiagnosis(diagnosisId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosisId]);

  const onSubmit = async (data: DiagnosisFormType) => {
    console.log("DATA", data);
    if (diagnosisId)
      updateOne(data, diagnosisId);
    else
      createOne(data);
  };

  if (diagnosisId && loading) return <Loader />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate >
        <div className="p-6.5">
          <InputControl
            name="title"
            className="w-full mb-4.5"
            required
            label="Samenvatting diagnose"
            type="text"
            placeholder="Voer samenvatting van de diagnose in"
          />
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <InputControl
              name="description"
              className="w-full xl:w-1/2"
              required
              label="Aandoening"
              type="text"
              placeholder="Voer conditie van de patiënt in"
            />
            <InputControl
              name="diagnosis_code"
              className="w-full xl:w-1/2"
              required
              label="ICD Code"
              type="text"
              placeholder="Voer ICD-code van de diagnose in"
            />
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <ControlledSelect
              name="severity"
              label="Ernst"
              required
              options={DIAGNOSIS_SEVERITY_OPTIONS}
              className="w-full xl:w-1/2"
            />
            <InputControl
              name="status"
              className="w-full xl:w-1/2"
              required
              label="Status"
              type="text"
              placeholder="Voer huidige status van de patiënt in"
            />
          </div>

          <TextareaControlled
            rows={6}
            name="notes"
            required
            className={"mb-6"}
            label="Diagnose notities"
            placeholder="Geef notities voor de diagnose"
          />

          <Button
            type={"submit"}
            disabled={isSubmitting}
            isLoading={isSubmitting}
            formNoValidate={true}
            loadingText={diagnosisId ? "Bijwerken..." : "Toevoegen..."}
          >
            {diagnosisId ? "Diagnose bijwerken" : "Diagnose indienen"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DiagnosisForm;
