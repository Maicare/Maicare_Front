"use client";
import { useForm, FormProvider, Resolver, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputControl from "@/common/components/InputControl";
import { FunctionComponent, useEffect, useState } from "react";
import Loader from '@/components/common/loader';
import { GenericSelectionOption } from "@/types/selection-option.types";
import { Contact as ContactType, OP_CLIENT_TYPE } from "@/types/contacts.types";
import { ControlledSelect } from "@/common/components/ControlledSelect";
import Button from "../common/Buttons/Button";
import ContactItemFields from "./ContactItemFields";
import { useContact } from "@/hooks/contact/use-contact";
import { OpOrgContactFormSchema } from "@/schemas/contact.schema";
import { useRouter } from "next/navigation";


type PropsType = {
    contactId?: number | null;
}

export type OpClientType = (typeof OP_CLIENT_TYPE)[number];

const OPTIONS: GenericSelectionOption<string, OpClientType | "">[] = [
    { label: "Selecteer type", value: "" },
    { label: "Hoofdaanbieder", value: "main_provider" },
    { label: "Gemeente", value: "local_authority" },
    { label: "Particuliere partij", value: "particular_party" },
    { label: "Zorginstelling", value: "healthcare_institution" },
];

const ContactForm: FunctionComponent<PropsType> = ({ contactId }) => {

    const router = useRouter();

    const { addContact, readOne, updateContact } = useContact();


    const [contact, setContact] = useState<ContactType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initialValues: ContactType = {
        types: "",
        name: "",
        contacts: [
            {
                name: "",
                email: "",
                phone_number: "",
            }
        ],
        address: "",
        postal_code: "",
        place: "",
        land: "",
        kvknumber: "",
        btwnumber: "",
        phone_number: "",
        client_number: "",
    }

    const methods = useForm<ContactType>({
        resolver: yupResolver(OpOrgContactFormSchema) as Resolver<ContactType>,
        defaultValues: contact ?? initialValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = methods;


    useEffect(() => {
        const fetchContact = async (id: number) => {
            const data = await readOne(id);
            setContact(data);
            setIsLoading(false);
        }
        if (contactId) fetchContact(contactId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactId])

    useEffect(() => {
        if (contactId && contact) {
            reset(contact);
        }
    }, [isLoading, reset, contact, contactId])

    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: "contacts",
    });

    const onSubmit = async (data: ContactType) => {
        if (contactId) {
            await updateContact(contactId, data)
        } else {
            await addContact(data);
            reset(initialValues)
        }

        router.replace("/contacts")

    };

    const addItem = () => {
        append({ name: "", email: "", phone_number: "" });
    };

    const removeItem = (index: number) => {
        remove(index);
    };


    if (contactId && isLoading)
        return <Loader />

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6">
                <h3 className="text-lg font-semibold mb-6">Opdrachtgever</h3>

                <ControlledSelect className={"mb-4"} options={OPTIONS} name="types" label={"Opdrachtgever type"} />
                <InputControl
                    name="name"
                    className="mb-4"
                    placeholder={"Naam"}
                    required
                    label="Naam"
                    type="text"
                />
                <h3 className="text-lg font-semibold mb-6">Contactpersonen</h3>

                {fields.map((field, index) => (
                    <ContactItemFields
                        order={index}
                        key={field.id} // Changed from key={index} to key={field.id}
                        onRemove={() => removeItem(index)} // Ensured removeItem is called with the correct index
                    />
                ))}
                <Button className={"mb-5 px-6"} onClick={addItem}>
                    + Voeg contact toe
                </Button>
                <InputControl
                    name="address"
                    className="mb-4"
                    placeholder={"Adres"}
                    required
                    label="Adres"
                    type="text"
                />
                <h3 className="text-lg font-semibold mb-6">Coördinaten</h3>
                <div className="flex flex-col lg:flex-row gap-3">
                    <InputControl
                        name="postal_code"
                        className="mb-4"
                        placeholder={"Postcode"}
                        required
                        label="Postcode"
                        type="text"
                    />
                    <InputControl
                        name="place"
                        className="mb-4 grow"
                        placeholder={"Plaats"}
                        required
                        label="Plaats"
                        type="text"
                    />
                    <InputControl
                        name="land"
                        className="mb-4"
                        placeholder={"Land"}
                        required
                        label="Land"
                        type="text"
                    />
                </div>
                <div className="flex flex-col lg:flex-row gap-3">
                    <InputControl
                        name="kvknumber"
                        className="mb-4"
                        placeholder={"KvK nummer"}
                        required
                        label="KvK nummer"
                        type="text"
                    />
                    <InputControl
                        name="btwnumber"
                        className="mb-4 grow"
                        placeholder={"BTW nummer"}
                        required
                        label="BTW nummer"
                        type="text"
                    />
                    <InputControl
                        name="phone_number"
                        className="mb-4"
                        placeholder={"Telefoonnummer"}
                        required
                        label="Telefoonnummer"
                        type="text"
                    />
                </div>
                <InputControl
                    name="client_number"
                    className="mb-10"
                    placeholder={"Clientnummer"}
                    required
                    label="Clientnummer"
                    type="text"
                />
                <Button
                    isLoading={isSubmitting}
                    loadingText={"Opdrachtgever wordt opgeslagen..."}
                    type={"submit"}
                    formNoValidate={true}
                >
                    {contactId ? "Een nieuwe opdrachtgever toevoegen" : "Bijwerken"}
                    Een nieuwe opdrachtgever toevoegen
                </Button>
            </form>
        </FormProvider>
    );
};

export default ContactForm;
