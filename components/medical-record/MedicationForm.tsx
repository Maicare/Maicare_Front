"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import InputControl from "@/common/components/InputControl";
import TextareaControlled from "../common/FormFields/TextareaControlled";
import Button from "../common/Buttons/Button";
import Loader from "../common/loader";
import { useMedication } from "@/hooks/medication/use-medication";
import { MedicationForm as MedicationFormType } from "@/types/medication.types";
import ControlledCheckboxItem from "@/common/components/ControlledCheckboxItem";



type PropsType = {
    clientId: string;
    medicationId?: string;
};

const MedicationForm: FunctionComponent<PropsType> = ({ medicationId, clientId }) => {

    const { readOne } = useMedication(parseInt(clientId));

    const [loading, setLoading] = useState(true)

    const initialValues: MedicationFormType = {
        name: "",
        dosage: "",
        start_date: "",
        end_date: "",
        slots: [],
        notes: "",
        administered_by: undefined,
        self_administered: false,
        is_critical: false,
        all_administered: true
    };

    const methods = useForm<MedicationFormType>({
        // resolver: yupResolver(DiagnosisFormSchema) as Resolver<MedicationFormType>,
        defaultValues: initialValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = methods;

    useEffect(() => {
        if (medicationId) {
            const fetchDiagnosis = async (id: string) => {
                const data = await readOne(id);
                reset(data);
                setLoading(false)
            }
            fetchDiagnosis(medicationId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [medicationId]);

    const onSubmit = async (data: MedicationFormType) => {
        console.log("DATA", data);
        // if (medicationId)
        //     updateOne(data, medicationId);
        // else
        //     createOne(data);
    };


    if (medicationId && loading)
        return <Loader />

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate >
                <div className="p-6.5">
                    <InputControl
                        name="name"
                        className="w-full mb-4.5"
                        required
                        label="Naam van Medicatie"
                        type="text"
                        placeholder="Enter medication name"
                    />
                    <InputControl
                        name="dosage"
                        className="w-full mb-4.5"
                        required
                        label="Dosering"
                        type="text"
                        placeholder="Enter dosage"
                    />

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <InputControl
                            name="start_date"
                            className="w-full xl:w-1/2"
                            required
                            label="Startdatum"
                            type="date"
                        />
                        <InputControl
                            name="end_date"
                            className={"w-full xl:w-1/2"}
                            required
                            label="Einddatum"
                            type="date"
                        />
                    </div>

                    <ControlledCheckboxItem
                        name="all_administered"
                        className={"mb-6"}
                        label='Beheerd door iedereen (met de toestemming "medische meldingen ontvangen".)'
                    />

                    <TextareaControlled
                        rows={6}
                        name="notes"
                        required
                        className={"mb-6"}
                        label="Notities bij Medicatie"
                        placeholder="Please provide notes for this medication"
                    />
                    <ControlledCheckboxItem
                        name="self_administered"
                        className={"mb-6"}
                        label='Zelf toegediend ?'
                    />
                    <ControlledCheckboxItem
                        name="is_critical"
                        className={"mb-6"}
                        label='Kritiek Medicatie'
                    />

                    <Button
                        type={"submit"}
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        formNoValidate={true}
                        loadingText={medicationId ? "Bijwerken..." : "Toevoegen..."}
                    >
                        {medicationId ? "Medicatie bijwerken" : "Medicatie indienen"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default MedicationForm;
