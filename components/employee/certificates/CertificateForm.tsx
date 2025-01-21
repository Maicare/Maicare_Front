import InputControl from "@/common/components/InputControl";
import Button from "@/components/common/Buttons/Button";
import { useEmployee } from "@/hooks/employee/use-employee";
import { Certification, CreateCertificate, initialValues } from "@/types/certification.types";
import { FormProps } from "@/types/form-props";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { FunctionComponent, useEffect, useState } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import * as Yup from "yup";


type Props = FormProps<Certification|undefined> & {
    employeeId: number;
};

const certificateSchema: Yup.ObjectSchema<CreateCertificate> = Yup.object({
    name: Yup.string().required("Titel is vereist"),
    issued_by: Yup.string().required("Uitgever is vereist"),
    date_issued: Yup.string().required("Datum van uitgifte is vereist"),
    employee_id: Yup.number().required("Datum van uitgifte is vereist"),
});

const CertificationForm: FunctionComponent<Props> = ({
    mode = "add",
    onSuccess,
    employeeId,
    initialData,
}) => {
    const { createOneCertificate, updateOneCertificate } = useEmployee({ autoFetch: false });
    const [loading, setLoading] = useState(false);
    async function onSubmit(value: CreateCertificate) {
        if (mode === "add") {
            try {
                setLoading(true);
                await createOneCertificate(
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
                await updateOneCertificate(
                    {
                        ...value,
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
    const methods = useForm<CreateCertificate>({
        resolver: yupResolver(certificateSchema) as Resolver<CreateCertificate>,
        defaultValues: initialData ?? initialValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting,errors },
        reset
    } = methods;
    console.log({errors})
    useEffect(() => {
        if (employeeId && initialData) {
            reset({
                ...initialData,
            });
        }
    }, [loading, reset, initialData, employeeId]);


    return (
        <FormProvider {...methods}>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <InputControl
                        className="w-full xl:w-1/2"
                        name="name"
                        id="name"
                        label="Titel"
                        placeholder="Voer alstublieft de titel van het certificaat in"
                        type="text"
                        required={true}
                    />
                    <InputControl
                        className="w-full xl:w-1/2"
                        name="issued_by"
                        id="issued_by"
                        label="Uitgegeven Door"
                        placeholder="Voer alstublieft de naam van de uitgever in"
                        type="text"
                        required={true}
                    />
                </div>
                <div className="mb-6 flex flex-col gap-6 xl:flex-row">
                    <InputControl
                        className="w-full xl:w-1/2"
                        name="date_issued"
                        id="date_issued"
                        label="Datum Uitgegeven"
                        placeholder="Please enter the date the certificate was issued"
                        required={true}
                        type="date"
                    />
                    <div className="w-full xl:w-1/2" />
                </div>
                <Button
                    type="submit"
                    formNoValidate={true}
                    isLoading={loading}
                    disabled={isSubmitting}
                    loadingText={mode === "add" ? "Toevoegen..." : "Bijwerken..."}
                >
                    {mode === "add" ? "Certificaat Indienen" : "Certificaat Bijwerken"}
                </Button>
            </form>
        </FormProvider>
    );
};

export default CertificationForm;
