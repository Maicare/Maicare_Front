"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import InputControl from "@/common/components/InputControl";
import { ControlledSelect } from "@/common/components/ControlledSelect";
import { ALLERGY_TYPE_OPTIONS, DIAGNOSIS_SEVERITY_OPTIONS } from "@/consts";
import TextareaControlled from "../common/FormFields/TextareaControlled";
import Button from "../common/Buttons/Button";
import { AllergyFormSchema } from "@/schemas/client.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { AllergyForm as AllergyFormType } from "@/types/allergy.types";
import { useAllergy } from "@/hooks/allergy/use-allergy";
import Loader from "../common/loader";



type PropsType = {
    clientId: string;
    allergyId?: string;
};

const AllergyForm: FunctionComponent<PropsType> = ({ allergyId, clientId }) => {

    const { createOne, readOne, updateOne } = useAllergy(parseInt(clientId));

    const [loading, setLoading] = useState(true)

    const initialValues: AllergyFormType = {
        allergy_id: "",
        severity: "",
        reaction: "",
        notes: "",
    };

    const methods = useForm<AllergyFormType>({
        resolver: yupResolver(AllergyFormSchema) as Resolver<AllergyFormType>,
        defaultValues: initialValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = methods;

    useEffect(() => {
        if (allergyId) {
            const fetchAllergy = async (id: string) => {
                const data = await readOne(id);
                reset({
                    severity: data.severity,
                    reaction: data.reaction,
                    notes: data.notes,
                    allergy_id: data.allergy_type_id
                });
                setLoading(false)
            }
            fetchAllergy(allergyId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allergyId]);

    const onSubmit = async (data: AllergyFormType) => {
        console.log("DATA", data);
        if (allergyId)
            updateOne(data, allergyId);
        else
            createOne(data);
    };

    if (loading) return <Loader />;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <ControlledSelect
                        name="allergy_id"
                        label="Type Allergie"
                        required
                        options={ALLERGY_TYPE_OPTIONS}
                        className="w-full xl:w-1/2"
                    />
                    <ControlledSelect
                        name="severity"
                        label="Ernst"
                        required
                        options={DIAGNOSIS_SEVERITY_OPTIONS}
                        className="w-full xl:w-1/2"
                    />
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                    <InputControl
                        name="reaction"
                        className="w-full xl:w-1/2"
                        required
                        label="Reactie"
                        type="text"
                        placeholder="Voer reactie op de allergie in"
                    />

                </div>

                <TextareaControlled
                    rows={6}
                    name="notes"
                    required
                    className={"mb-6"}
                    label="Notities Diagnose"
                    placeholder="Verschaf notities voor de diagnose"
                />

                <Button
                    type={"submit"}
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    formNoValidate={true}
                    loadingText={allergyId ? "Bijwerken..." : "Toevoegen..."}
                >
                    {allergyId ? "Allergie bijwerken" : "Allergie indienen"}
                </Button>
            </form>
        </FormProvider>
    );
};

export default AllergyForm;
