"use client";

import React, { FunctionComponent, useState } from "react";
import Button from "@/components/common/Buttons/Button";
import SelectControlled from "@/common/components/SelectControlled";
import { LEVEL_OPTIONS } from "@/types/maturity-matrix.types";
import { ControlledDomainSelect } from "@/components/ControlledDomainSelect/ControlledDomainSelect";
import { CreateAssessment } from "@/types/assessment.types";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AssessmentSchema } from "@/schemas/assessment.schema";
import InputControl from "@/common/components/InputControl";
import dayjs from "dayjs";
import { useDomain } from "@/hooks/domain/use-domain";
import { useRouter } from "next/navigation";
import DetailCell from "@/components/common/DetailCell";
import { fullDateFormat } from "@/utils/timeFormatting";
import Panel from "@/components/common/Panel/Panel";
import IconButton from "@/components/common/Buttons/IconButton";
import { X } from "lucide-react";
import { ZRM_MATRIX } from "@/types/goals.types";

type PropsType = {
  clientId: string;
};
const initialValues: CreateAssessment = {
  maturity_matrix_id: 0,
  initial_level: 0,
  start_date: "",
  end_date: "",
};
export const GoalForm: FunctionComponent<PropsType> = ({ clientId }) => {
  const { createOne, domains } = useDomain({ autoFetch: true });
  const [formData, setFormData] = useState<CreateAssessment[]>([]);
  const router = useRouter();
  const methods = useForm<CreateAssessment>({
    resolver: yupResolver(AssessmentSchema),
    defaultValues: initialValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting, isValid, },
    getValues,
    watch
    // reset
  } = methods;
  const {maturity_matrix_id,initial_level} = watch();
  const onSubmit = async (_data: CreateAssessment) => {
    try {
      const data = formData.map(i=>({
        ...i,
        initial_level:parseInt(i.initial_level as unknown as string),
        maturity_matrix_id:parseInt(i.maturity_matrix_id as unknown as string),
        start_date:i.start_date+"T15:04:05Z",
        end_date:i.end_date+"T15:04:05Z",
      }))
      await createOne(data, +clientId, { displayProgress: true, displaySuccess: true });
      router.push(`/clients/${clientId}/goals`);
    } catch (error) {
      console.error({ error });
    }
  };
  const AddToFormdata = () => {
    const data = getValues();
    setFormData(prev => [...prev, data]);
  }
  const RemoveFromFormdata = (index: number) => {
    setFormData(prev => prev.filter((_item, id) => id !== index));
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit,()=>{})} className="p-6.5 pt-4.5">
        <ControlledDomainSelect
          label={"Domein"}
          name={"maturity_matrix_id"}
          required={true}
          className={"w-full mb-4.5"}
        />
        <SelectControlled
          label={"Level"}
          name={"initial_level"}
          required={true}
          options={LEVEL_OPTIONS}
          className={"w-full mb-4.5"}
        />
        {maturity_matrix_id  ? (
          <div className="p-6.5 bg-meta-6/20">
            <ul>
              {ZRM_MATRIX.levels[parseInt(`${initial_level}`)+1 as keyof typeof ZRM_MATRIX.levels]?.domains[parseInt(`${maturity_matrix_id}`) as keyof typeof ZRM_MATRIX.levels].map((item, index) => (
                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="flex gap-4 mt-4">
          <InputControl
            className={"w-full mb-4.5"}
            required={true}
            id={"start_date"}
            name="start_date"
            max={dayjs().format("YYYY-MM-DDTHH:mm")}
            label={"Datum en tijd"}
            type={"date"}
            placeholder={"Voer de titel van de rapporten in"}
          />
          <InputControl
            className={"w-full mb-4.5"}
            required={true}
            id={"end_date"}
            name="end_date"
            max={dayjs().format("YYYY-MM-DDTHH:mm")}
            label={"Datum en tijd"}
            type={"date"}
            placeholder={"Voer de titel van de rapporten in"}
          />
        </div>
        <div className="flex justify-end gap-4.5 mt-4">
          <Button type={"button"} onClick={AddToFormdata} disabled={!isValid}>
            Add Assessment
          </Button>
        </div>
        {
          formData.length > 0 && (
            <div className="">
              {formData.map((item, index) => (
                <Panel title={`assessment ${index}`} className="mt-6 " key={index}>
                  <div className="flex justify-between items-center">
                    <div className="flex">
                      <DetailCell
                        ignoreIfEmpty={true}
                        label={"Domein"}
                        className="p-5"
                        value={domains?.find(it => it.id === item.maturity_matrix_id)?.topic_name || "Niet gespecificeerd"}
                      />
                      <DetailCell
                        ignoreIfEmpty={true}
                        label={"Level"}
                        className="p-5"
                        value={LEVEL_OPTIONS.find(it => it.value === item.initial_level.toString())?.label || "Niet gespecificeerd"}
                      />
                      <DetailCell
                        ignoreIfEmpty={true}
                        label={"start date"}
                        className="p-5"
                        value={fullDateFormat(item.start_date) || "Niet gespecificeerd"}
                      />
                      <DetailCell
                        ignoreIfEmpty={true}
                        label={"end date"}
                        className="p-5"
                        value={fullDateFormat(item.end_date) || "Niet gespecificeerd"}
                      />
                    </div>
                    <IconButton className="h-8 w-8 flex items-center justify-center bg-c_red mr-4" onClick={() => RemoveFromFormdata(index)} >
                      <X className="h-8 w-8 " />
                    </IconButton>
                  </div>

                </Panel>
              ))}
              <div className="flex justify-end gap-4.5 mt-4">
                <Button type={"submit"} disabled={isSubmitting} isLoading={isSubmitting} formNoValidate={true}>
                  Create
                </Button>
              </div>
            </div>
          )
        }
      </form>
    </FormProvider>
  );
};

export default GoalForm;
