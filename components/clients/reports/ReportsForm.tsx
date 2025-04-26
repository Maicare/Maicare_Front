"use client";

import React, { FunctionComponent  } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/common/Buttons/Button";
import SelectControlled from "@/common/components/SelectControlled";
import InputControl from "@/common/components/InputControl";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateReport, DAILY_REPORT_TYPES_OPTIONS, EMOTIONAL_STATE_OPTIONS, Report } from "@/types/reports.types";
import { ReportSchema } from "@/schemas/report.schema";
import { Id } from "@/common/types/types";
import SmartTextarea from "@/common/components/SmartTextareaControl";


const initialValues: CreateReport = {
    report_text: "",
    date: "",
    emotional_state: "",
    employee_id: 0,
    type: "",
};



type PropsType = {
    clientId: Id;
    className?: string;
    mode: string;
    reportId?: Id;
    report?: Report;
};

export const ReportsForm: FunctionComponent<PropsType> = ({
    clientId,
    className,
    mode,
    report = initialValues,
}) => {

    const methods = useForm<CreateReport>({
        resolver: yupResolver(ReportSchema),
        defaultValues: report,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const onSubmit = async (_data: Report) => {
        // try {
        //     if (mode === "edit") {
        //         await updateOne({...data,employee_id:user?.employee_id||0,date:data.date + ":00Z"});
        //     } else {
        //         await createOne({...data,employee_id:user?.employee_id||0,date:data.date + ":00Z"});
        //     }
        //     router.push(`/clients/${clientId}/reports`);
        // } catch (error) {
        //     console.error({error});
        // }
    }
    const medicationRecords = {
        count: 2,
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={className}>
                {medicationRecords?.count > 0 && (
                    <div className="p-6.5 bg-meta-6/20">
                        <p>
                            Er zijn nog medicatie records die nog niet zijn gerapporteerd. Gelieve eerst de
                            medicatie records te rapporteren voordat u een rapport indient.{" "}
                            <Link
                                className="underline text-primary"
                                href={`/clients/${clientId}/medical-record/medications`}
                            >
                                Klik hier om naar de medicatie records te gaan
                            </Link>
                        </p>
                    </div>
                )}
                <div className="p-6.5">
                    <SelectControlled
                        label={"Type rapport"}
                        name={"type"}
                        required={true}
                        options={DAILY_REPORT_TYPES_OPTIONS}
                        className={"w-full mb-4.5"}
                    />
                    <SelectControlled
                        label={"Emotionele toestand"}
                        name={"emotional_state"}
                        required={true}
                        options={EMOTIONAL_STATE_OPTIONS}
                        className={"w-full mb-4.5"}
                    />

                    <InputControl
                        className={"w-full mb-4.5"}
                        required={true}
                        id={"date"}
                        name="date"
                        max={dayjs().format("YYYY-MM-DDTHH:mm")}
                        label={"Datum en tijd"}
                        type={"datetime-local"}
                        placeholder={"Voer de titel van de rapporten in"}
                    />

                    <SmartTextarea
                        rows={10}
                        id={"report_text"}
                        name={"report_text"}
                        modalTitle={"Rapporten verbeteren"}
                        required={true}
                        className={"mb-6"}
                        label={"Rapporten"}
                        placeholder={"Geef alstublieft rapporten"}
                    />
                    <Button
                        type={"submit"}
                          disabled={isSubmitting}
                          isLoading={isSubmitting}
                        formNoValidate={true}
                        loadingText={mode === "edit" ? "Bijwerken..." : "Toevoegen..."}
                        className="mt-6"
                    >
                        {mode === "edit" ? "Rapport bijwerken" : "Rapport indienen"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default ReportsForm;
