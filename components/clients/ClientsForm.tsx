"use client";

import React, { FunctionComponent } from "react";
import Panel from "../common/Panel/Panel";
import InputControl from "@/common/components/InputControl";
import { useClient } from "@/hooks/client/use-client";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { CreateClientInput } from "@/types/client.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateClientSchema } from "@/schemas/client.schema";
import Button from "../common/Buttons/Button";
import ControlledRadioGroup from "@/common/components/ControlledRadioGroup";
import SelectControlled from "@/common/components/SelectControlled";
import { SOURCE_OPTIONS } from "@/common/data/gender.data";
import { ControlledLocationSelect } from "../ControlledLocationSelect/ControlledLocationSelect";
import AddressesControlled from "../address/AddressesControlled";





type PropsType = {
    clientId?: number;
    mode: string;
};

export const ClientsForm: FunctionComponent<PropsType> = ({ clientId, mode }) => {
    const { createOne } = useClient({ clientId: 1 });
    const methods = useForm<CreateClientInput>({
        resolver: yupResolver(CreateClientSchema) as Resolver<CreateClientInput>,
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            organisation: "",
            location: "",
            legal_measure: "",
            birthplace: "",
            departement: "",
            gender: "",
            filenumber: "",
            phone_number: "",
            bsn: "",
            source: "",
            date_of_birth: "",
            city: "",
            Zipcode: "",
            addresses: [],
            infix: undefined,
            streetname: "",
            street_number: "",
            added_identity_documents: undefined,
            removed_identity_documents: undefined,
            departure_reason: undefined,
            departure_report: undefined,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting, errors },
    } = methods;
    console.log(errors);

    const onSubmit = async (data: CreateClientInput) => {
        
        // await createOne(data, { displayProgress: true, displaySuccess: true });
        console.log(data);
    };


    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-9">
                            <Panel containerClassName="p-6.5 pb-5" title={"Persoonlijke Gegevens"}>
                                <div className="mb-4.5 py-4 flex flex-col gap-6 xl:flex-row">
                                    <InputControl
                                        type={"text"}
                                        label={"Voornaam"}
                                        id={"first_name"}
                                        name={"first_name"}
                                        placeholder={"Voer uw voornaam in"}
                                        className="w-full xl:w-1/2"
                                        required={true}
                                    />

                                    <InputControl
                                        type={"text"}
                                        label={"Achternaam"}
                                        id={"last_name"}
                                        name={"last_name"}
                                        placeholder={"Voer uw achternaam in"}
                                        className="w-full xl:w-1/2"
                                        required={true}
                                    />
                                </div>

                                <InputControl
                                    type={"text"}
                                    label={"E-mail"}
                                    id={"email"}
                                    name={"email"}
                                    placeholder={"Voer uw e-mailadres in"}
                                    className="w-full mb-4.5"
                                    required={true}
                                />

                                <InputControl
                                    label={"Telefoonnummer"}
                                    id={"phone_number"}
                                    name={"phone_number"}
                                    placeholder={"Voer uw telefoonnummer in"}
                                    type={"text"}
                                    className="w-full mb-4.5"
                                    required={true}
                                />

                                <InputControl
                                    label={"Tussenvoegsel"}
                                    id={"infix"}
                                    name={"infix"}
                                    placeholder={"Voer tussenvoegsel in"}
                                    type={"text"}
                                    className="w-full mb-4.5"
                                />
                                <div className="flex flex-col mb-4.5">
                                    <h3 className="font-medium text-slate-800  dark:text-white mb-2.5">Geslacht</h3>
                                    <ControlledRadioGroup
                                        options={
                                            [
                                                {
                                                    label: "Male",
                                                    value: "male"
                                                },
                                                {
                                                    label: "Female",
                                                    value: "female"
                                                },
                                                {
                                                    label: "Other",
                                                    value: "other"
                                                }
                                            ]
                                        }
                                        name={"gender"}
                                    />
                                </div>
                                <InputControl
                                    label={"Geboortedatum"}
                                    placeholder={"Geboortedatum"}
                                    required={true}
                                    id={"date_of_birth"}
                                    name={"date_of_birth"}
                                    type={"date"}
                                    className="w-full mb-4.5"
                                />
                                <InputControl
                                    label={"Geboorteplaats"}
                                    id={"birthplace"}
                                    name={"birthplace"}
                                    placeholder={"Geboorteplaats"}
                                    type={"text"}
                                    className="w-full mb-4.5"
                                />

                                <div className="mb-4.5">
                                    <InputControl
                                        label={"Dossiernummer"}
                                        id={"filenumber"}
                                        name={"filenumber"}
                                        placeholder={"Voer BSN in"}
                                        type={"number"}
                                        className="w-full mb-4.5"
                                        required={true}
                                    />
                                    <input
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none  transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        id={"filenumber"}
                                        name={"filenumber"}
                                        placeholder={"Dossiernummer"}
                                        type={"number"}
                                    />
                                </div>
                            </Panel>

                            <Panel containerClassName="p-6.5 pb-5" title={"Identiteitsgegevens"}>
                                <InputControl
                                    label={"BSN"}
                                    id={"bsn"}
                                    name={"bsn"}
                                    placeholder={"Voer BSN in"}
                                    type={"text"}
                                    className="w-full mb-4.5"
                                    required={true}
                                />
                                <SelectControlled
                                    label={"Bron"}
                                    id={"source"}
                                    name={"source"}
                                    options={SOURCE_OPTIONS}
                                    className="w-full mb-4.5"
                                    required={true}
                                />
                                {/* identity documents */}
                                {/* <FilesUploader
                                    label={"Identiteitsdocumenten"}
                                    name={"added_identity_documents"}
                                    endpoint={"global_v2"}
                                /> */}

                            </Panel>
                        </div>
                        <div className="flex flex-col gap-9">
                            <Panel containerClassName="p-6.5 pb-5" title={"Locatiegegevens"}>
                                <ControlledLocationSelect
                                    id={"location"}
                                    name={"location"}
                                    label={"Locatie"}
                                    className="w-full mb-4.5"
                                    required={true}
                                />
                                <SelectControlled
                                    label={"Rechtsmaatregel"}
                                    id={"legal_measure"}
                                    name={"legal_measure"}
                                    options={[
                                        {
                                            value: "Jeugdreclassering ",
                                            label: "Jeugdreclassering ",
                                        },
                                        {
                                            value: "Jeugdbescherming",
                                            label: "Jeugdbescherming",
                                        }
                                    ]}
                                    className="w-full mb-4.5"
                                    required={true}
                                />
                                <InputControl
                                    label={"Afdeling"}
                                    id={"departement"}
                                    name={"departement"}
                                    placeholder={"Afdeling"}
                                    type={"text"}
                                    className="w-full mb-4.5"
                                />
                                <InputControl
                                    label={"Organisatie"}
                                    id={"organisation"}
                                    name={"organisation"}
                                    placeholder={"Organisatie"}
                                    type={"text"}
                                    className="w-full mb-4.5"
                                />
                            </Panel>

                            <Panel containerClassName="p-6.5 pb-5" title={"Adresgegevens"}>
                                <AddressesControlled className="" />
                            </Panel>
                        </div>
                        <Button
                            type={"submit"}
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                            formNoValidate={true}
                            loadingText={"Toevoegen..."}
                        >
                            {"Cliënten Indienen"}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};

export default ClientsForm;