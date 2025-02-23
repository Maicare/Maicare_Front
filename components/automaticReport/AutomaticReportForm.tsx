import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/Buttons/Button";
import InputControl from "@/common/components/InputControl";
import { useAutomaticReport } from "@/hooks/automatic-report/use-automatic-report";
import dayjs from "dayjs";
import TextareaControlled from "../common/FormFields/TextareaControlled";
import {
  CreateAutomaticReport,
  ValidateAutomaticReport,
} from "@/types/automatic-report.types";

const schema = yup.object().shape({
  start_date: yup.string().required("Start date is required"),
  end_date: yup.string().required("End date is required"),
  report_text: yup.string(),
});

const NewAutomaticReports = ({ clientId }: { clientId: number }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidate, setShowValidate] = useState(false);

  const { generateOne, validateOne } = useAutomaticReport({
    clientId: clientId,
    autoFetch: false,
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      start_date: "",
      end_date: "",
      report_text: "",
    },
  });

  const { handleSubmit, setValue, setError } = methods;

  const onGenerate = async (data: CreateAutomaticReport) => {
    try {
      setIsGenerating(true);
      const response = await generateOne(
        {
          start_date: data.start_date + ":00Z",
          end_date: data.end_date + ":00Z",
        },
        { displayProgress: true }
      );
      setValue("report_text", response.report);
      setShowValidate(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onValidate = async (data: ValidateAutomaticReport) => {
    if (!data.report_text) {
      setError("report_text", {
        type: "manual",
        message: "Report text cannot be empty",
      });
      return;
    }

    try {
      setIsValidating(true);
      await validateOne(
        {
          start_date: data.start_date + ":00Z",
          end_date: data.end_date + ":00Z",
          report_text: data.report_text,
        },
        { displayProgress: true, displaySuccess: true }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(showValidate ? onValidate : onGenerate)}
        className="p-6.5"
      >
        <div className="grid grid-cols-2 gap-4 mb-4.5">
          <InputControl
            className="w-full"
            required={true}
            id="start_date"
            name="start_date"
            max={dayjs().format("YYYY-MM-DDTHH:mm")}
            label="Start Datum en tijd"
            type="datetime-local"
          />

          <InputControl
            className="w-full"
            required={true}
            id="end_date"
            name="end_date"
            max={dayjs().format("YYYY-MM-DDTHH:mm")}
            label="Eind Datum en tijd"
            type="datetime-local"
          />
        </div>

        {showValidate && (
          <TextareaControlled
            rows={10}
            name="report_text"
            required={true}
            className="mb-6"
            label="Gegenereerd Rapport"
            placeholder="Gegenereerd rapport text"
          />
        )}

        <div className="flex justify-end gap-4.5 mt-6 px-4">
          <div className="flex justify-end gap-4.5 mt-6 px-4">
            <Button
              type="button"
              onClick={() => handleSubmit(onGenerate)()}
              disabled={isGenerating}
              isLoading={isGenerating}
              loadingText="Genereren..."
              className="px-6 py-2"
            >
              Rapport Genereren
            </Button>

            {showValidate && (
              <Button
                type="submit"
                disabled={isGenerating || isValidating}
                isLoading={isValidating}
                loadingText="Valideren..."
                className="px-6 py-2"
              >
                Valideren & Opslaan
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default NewAutomaticReports;
