"use client";

import { useParams, useRouter } from "next/navigation";
import UpsertIncidentForm from "../_components/UpsertIncidentForm";


const Page = () => {
    const router = useRouter();
    const {clientId} = useParams();
    const onSuccess = () => {
        router.push(`/test/client/${clientId}/incidents`)
    }
    const onCancel = () => {
        router.back();
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Clienten Aanmaken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Clienten Aanmaken</span></p>
            </div>
            <UpsertIncidentForm 
                mode="create"
                onSuccess={onSuccess}
                onCancel={onCancel}
                clientId={clientId as string}
            />
        </div>
    )
}

export default Page