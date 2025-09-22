"use client";

import { useParams, useRouter } from "next/navigation";
import UpsertClientForm from "../../_components/UpsertClientForm";
import { useClient } from "@/hooks/client/use-client";
import { useEffect, useState } from "react";
import { Id } from "@/common/types/types";
import { UpdateClientRequestBody } from "@/schemas/clientNew.schema";
import UpsertClientFormSkeleton from "../../_components/UpsertClientFormSkeleton";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";


const Page = () => {
    const router = useRouter();
    const { clientId } = useParams();

    const onSuccess = (id: number) => {
        router.push(`/clients/${id}/overview`)
    }
    const onCancel = () => {
        router.back();
    }
    const { readOne } = useClient({ autoFetch: false });
        const [client, setClient] = useState<UpdateClientRequestBody&{identity_attachment_ids:string[]} | undefined>(undefined);
        const [isLoading, setIsLoading] = useState(false);
        useEffect(() => {
            const fetchClient = async (id: Id) => {
                setIsLoading(true);
                const data = await readOne(id);
                setClient({...data,location_id:1} as UpdateClientRequestBody&{identity_attachment_ids:string[]});//TODO: ask taha to add locationId in client details
                setIsLoading(false);
            }
            if (clientId) fetchClient(+clientId);
            
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [clientId]);
        if (isLoading || !client) {
            return(
                <UpsertClientFormSkeleton />
            )
        }
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Clienten Aanmaken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Clienten Aanmaken</span></p>
            </div>
            <UpsertClientForm
                mode="update"
                onSuccess={onSuccess}
                onCancel={onCancel}
                defaultValues={client}
            />
        </div>
    )
}

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.UpdateClient, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );