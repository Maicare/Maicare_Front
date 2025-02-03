import { EmergencyContactForm as EmergencyContactFormType } from "@/types/emergency.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionComponent, useEffect, useState } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import Button from "../common/Buttons/Button";
import InputControl from "@/common/components/InputControl";
import { EMERGENCY_DISTANCE_OPTIONS, EMERGENCY_RELATIONSHIP_OPTIONS } from "@/consts";
import SelectControlled from "@/common/components/SelectControlled";
import ControlledCheckboxItem from "@/common/components/ControlledCheckboxItem";
import { ClientEmergencyContactForm } from "@/schemas/client.schema";
import { useEmergencyContact } from "@/hooks/client-network/use-emergency-contact";
import Loader from "../common/loader";

type PropsType = {
    clientId?: string;
    emergencyId?: string;
}

const EmergencyContactForm: FunctionComponent<PropsType> = ({ clientId, emergencyId }) => {

    const [loading, setLoading] = useState(true)

    const { createOne, readOne, updateOne } = useEmergencyContact({ clientId })


    const initialValues: EmergencyContactFormType = {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        relationship: "",
        relation_status: "",
        address: "",
        medical_reports: false,
        goals_reports: false,
        incidents_reports: false,
    }

    const methods = useForm<EmergencyContactFormType>({
        resolver: yupResolver(ClientEmergencyContactForm) as Resolver<EmergencyContactFormType>,
        defaultValues: initialValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = methods;

    useEffect(() => {
        if (emergencyId) {
            const fetchEmergency = async (id: string) => {
                const data = await readOne(id);
                reset({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    phone_number: data.phone_number,
                    relationship: data.relationship,
                    relation_status: data.relation_status,
                    address: data.address,
                    medical_reports: data.medical_reports,
                    goals_reports: data.goals_reports,
                    incidents_reports: data.incidents_reports,
                })
                setLoading(false)
            }
            fetchEmergency(emergencyId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emergencyId]);

    const onSubmit = async (data: EmergencyContactFormType) => {
        if (emergencyId)
            updateOne(data, emergencyId)
        else
            createOne(data)
    };

    if (emergencyId && loading)
        return <Loader />

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <InputControl
                        required
                        label={"Voornaam"}
                        name={"first_name"}
                        placeholder={"Voer Voornaam in"}
                        type={"text"}
                        className="w-full xl:w-1/2"
                    />
                    <InputControl
                        required
                        className={"w-full xl:w-1/2"}
                        label={"Achternaam"}
                        name={"last_name"}
                        type={"text"}
                        placeholder={"Voer Achternaam in"}
                    />
                </div>

                <InputControl
                    required
                    className={"w-full mb-4.5"}
                    label={"E-mailadres"}
                    name={"email"}
                    type={"text"}
                    placeholder={"Voer e-mailadres in"}
                />
                <InputControl
                    required={true}
                    label={"Telefoonnummer"}
                    name={"phone_number"}
                    placeholder={"Voer telefoonnummer in"}
                    type={"text"}
                    className={"w-full mb-4.5"}
                />

                <div className="mb-1 flex flex-col gap-6 xl:flex-row">
                    <SelectControlled
                        required={true}
                        label={"Relatie"}
                        name={"relationship"}
                        options={EMERGENCY_RELATIONSHIP_OPTIONS}
                        className="w-full xl:w-1/2"
                    />
                    <SelectControlled
                        required={true}
                        label={"Afstand"}
                        name={"relation_status"}
                        options={EMERGENCY_DISTANCE_OPTIONS}
                        className="w-full xl:w-1/2"
                    />
                </div>

                <div className="mb-5 pl-2">
                    <span className="text-sm font-bold cursor-pointer" >
                        Een nieuwe relatie aanmaken?
                    </span>
                </div>

                <InputControl
                    required={true}
                    className={"w-full mb-4.5"}
                    label={"Adres"}
                    name={"address"}
                    type={"text"}
                    placeholder={"Voer adres in"}
                />

                <ControlledCheckboxItem
                    className={"w-full mb-4.5"}
                    label={"Medische rapporten automatisch verzenden (wekelijks)?"}
                    name={"medical_reports"}
                />
                <ControlledCheckboxItem
                    className={"w-full mb-4.5"}
                    label={"Voortgangsrapporten automatisch versturen (wekelijks)?"}
                    name={"goals_reports"}
                />
                <ControlledCheckboxItem
                    className={"w-full mb-4.5"}
                    label={"Incidentenrapporten automatisch verzenden?"}
                    name={"incidents_reports"}
                />

                <Button
                    type={"submit"}
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    formNoValidate={true}
                    loadingText={false ? "Bijwerken..." : "Toevoegen..."}
                >
                    {emergencyId ? "Contact bijwerken" : "Contact indienen"}
                </Button>
            </form>
        </FormProvider>
    )
}

export default EmergencyContactForm;
