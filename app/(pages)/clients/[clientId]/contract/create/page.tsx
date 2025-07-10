"use client";

import { useParams, useRouter } from "next/navigation";
import { useClient } from "@/hooks/client/use-client";
import { useContact } from "@/hooks/contact/use-contact";
import { useContract } from "@/hooks/contract/use-contract";
import { useEffect, useState } from "react";
import { Client } from "@/types/client.types";
import { Any } from "@/common/types/types";
import { Contact } from "@/schemas/contact.schema";
import { CreateContract } from "@/schemas/contract.schema";
import { CreateContractForm } from "@/app/(pages)/clients/[clientId]/contract/_components/create-contract-form";
import { ContactOverviewSection } from "../_components/contact-overview-section";
const defaultContractValues: CreateContract = {
    VAT: 20,
    attachment_ids: [],
    care_name: "",
    care_type: "ambulante",
    end_date: undefined,
    financing_act: "WMO",
    financing_option: "ZIN",
    hours: 40,
    hours_type: "weekly",
    price: 0,
    price_time_unit: "monthly",
    reminder_period: 30,
    sender_id: 0,
    start_date: new Date().toISOString(),
    type_id: 0,
};
const Page = () => {
    const router = useRouter();
    const { clientId } = useParams();

    const { readOne: getClientData } = useClient({ autoFetch: false });
    const { readOne: getContactData } = useContact({ autoFetch: false });
    const { readContractTypes, addContractTypes,  createOne } = useContract({});



    const [clientData, setClientData] = useState<Client & {
        identity_attachment_ids: string[];
    } | null>(null);
    const [contact, setContact] = useState<Contact | null>(null);
    const [contractTypes, setContractTypes] = useState<Any[]>([]);

    useEffect(() => {
        const getClient = async () => {
            const data = await getClientData(parseInt(clientId as string));
            setClientData(data);
        };
        getClient();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId]);

    useEffect(() => {
        const getContact = async () => {
            const data = await getContactData(clientData?.sender_id||0);
            setContact(data);
        };

        if (clientData && clientData.sender_id) {
            getContact();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientData]);

    useEffect(() => {
        const getContractTypes = async () => {
            const data = await readContractTypes();
            setContractTypes(
                [
                    ...data.map((contractType) => ({
                        label: contractType.name,
                        value: contractType.id + "",
                    }))]
            );
        };
        getContractTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data: CreateContract) => {
        if (!clientData || !contact) {
            return;
        }
        const contractData: CreateContract = {
            ...data,
            sender_id: clientData.sender_id,
        };
        try {
            await createOne(contractData,clientId+"",{displayProgress: true, displaySuccess: true});
            router.push(`/clients/${clientId}/contracts`);
        } catch (error) {
            console.error("Error creating contract:", error);
            // Handle error appropriately, e.g., show a notification
        }
    };
    const createContractType = async (name: string) => {
        if (!clientData) {
            return;
        }
        try {
            const newContractType = await addContractTypes(name, { displayProgress: true, displaySuccess: true });
            setContractTypes((prev) => [
                ...prev,
                {
                    label: newContractType.name,
                    value: newContractType.id + "",
                },
            ]);
        } catch (error) {
            console.error("Error creating contract type:", error);
            // Handle error appropriately, e.g., show a notification
        }
    };

    if (!clientData || !contact) {
        return (
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-xl font-semibold">Uitzendkrachten Aanmaken</h1>
                    <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Uitzendkrachten Aanmaken</span></p>
                </div>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Uitzendkrachten Aanmaken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Uitzendkrachten Aanmaken</span></p>
            </div>
            <ContactOverviewSection
                contact={contact}
            />
            <CreateContractForm
                onSubmit={onSubmit}
                defaultValues={{ ...defaultContractValues, sender_id: clientData?.sender_id ?? 0 }}
                contractTypes={contractTypes}
                createContractType={createContractType}
            />
        </div>

    )
}

export default Page