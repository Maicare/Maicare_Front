"use client";

import { useContract } from "@/hooks/contract/use-contract";
import { Contract } from "@/schemas/contract.schema";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ContractOverview } from "../_components/contract-overview";

const Page = () => {
    const { clientId, contractId } = useParams();

    const { readOne } = useContract({ autoFetch: false });
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
    if (isLoading || !contract) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div className="container mx-auto py-8 px-4">
            <ContractOverview contract={contract} />
        </div>
    )
}

export default Page