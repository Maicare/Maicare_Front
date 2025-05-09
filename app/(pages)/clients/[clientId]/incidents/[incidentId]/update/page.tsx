"use client";

import { useParams, useRouter } from "next/navigation";
import UpsertIncidentForm from "../../_components/UpsertIncidentForm";
import {  Incident } from "@/types/incident.types";
import { useEffect, useState } from "react";
import { useIncident } from "@/hooks/incident/use-incident";
import { Id } from "@/common/types/types";
import UpsertIncidentFormSkeleton from "../../_components/UpsertIncidentFormSkeleton";


const Page = () => {
    const router = useRouter();
    const { clientId, incidentId } = useParams();
    const [incident, setIncident] = useState<Incident | null>(null);
    const { readOne } = useIncident({ autoFetch: false, clientId: parseInt(clientId as string) });
    const onSuccess = () => {
        router.push(`/clients/${clientId}/incidents`)
    }
    const onCancel = () => {
        router.back();
    }
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchIncident = async (id: Id) => {
            setIsLoading(true);
            const data = await readOne(id,+clientId!, { displayProgress: true });
            setIncident({ ...data });//TODO: ask taha to add locationId in client details
            setIsLoading(false);
        }
        if (incidentId && clientId) fetchIncident(+incidentId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId]);
    if (isLoading || !incident) {
        return (
            <UpsertIncidentFormSkeleton />
        )
    }


    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Clienten Aanmaken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Clienten Aanmaken</span></p>
            </div>
            <UpsertIncidentForm
                mode="update"
                onSuccess={onSuccess}
                onCancel={onCancel}
                clientId={clientId as string}
                incidentId={clientId as string}
                defaultValues={incident}
                
            />
        </div>
    )
}

export default Page