"use client";

import { useParams, useRouter } from "next/navigation";
import { useClient } from "@/hooks/client/use-client";
import { useContact } from "@/hooks/contact/use-contact";
import { useContract } from "@/hooks/contract/use-contract";
import { useEffect, useState } from "react";
import { Client } from "@/types/client.types";
import { Any } from "@/common/types/types";
import { Contact } from "@/schemas/contact.schema";
import { Contract, CreateContract } from "@/schemas/contract.schema";
import { ContactOverviewSection } from "../../_components/contact-overview-section";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { CreateContractForm } from "../../_components/create-contract-form";

const Page = () => {
    const router = useRouter();
    const { clientId,contractId } = useParams();

    const { readOne: getClientData } = useClient({ autoFetch: false });
    const { readOne: getContactData } = useContact({ autoFetch: false });
    const { readContractTypes, addContractTypes,  updateOne, readOne } = useContract({});

    const [contract, setContract] = useState<Contract & { type_name: string; sender_name: string; client_first_name: string; client_last_name: string; } | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchContract = async (id: string) => {
            setIsLoading(true);
            const data = await readOne(clientId as string, id, { displayProgress: true });
            setContract(data);
            setIsLoading(false);
        }
        if (contractId) fetchContract(contractId as string);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId]);

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
            const data = await getContactData(clientData?.sender_id || 0);
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
            console.error("Fout bij aanmaken contracttype:", error);
            // Handle error appropriately, e.g., show a notification
        }
    };

    const onSubmit = async (data: CreateContract) => {
        if (!clientData || !contact) {
            return;
        }
        const contractData: CreateContract = {
            ...data,
            sender_id: clientData.sender_id,
        };
        try {
            await updateOne(contractData, clientId + "", { displayProgress: true, displaySuccess: true });
            router.back();
        } catch (error) {
            console.error("Fout bij bijwerken contract:", error);
            // Handle error appropriately, e.g., show a notification
        }
    };

    if (!clientData || !contact || isLoading || !contract) {
        return (
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-xl font-semibold">Contract Bewerken</h1>
                    <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Contract Bewerken</span></p>
                </div>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                    <span className="sr-only">Laden...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Contract Bewerken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Contract Bewerken</span></p>
            </div>
            <ContactOverviewSection
                contact={contact}
            />
            <CreateContractForm
                onSubmit={onSubmit}
                defaultValues={{ ...contract, sender_id: clientData?.sender_id ?? 0 }}
                contractTypes={contractTypes}
                createContractType={createContractType}
            />
        </div>

    )
}

export default withAuth(
    withPermissions(Page, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.UpdateContract, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);