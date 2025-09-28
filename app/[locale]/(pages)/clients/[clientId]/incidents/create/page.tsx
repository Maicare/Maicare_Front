"use client";

import { useParams, useRouter } from "next/navigation";
import UpsertIncidentForm from "../_components/UpsertIncidentForm";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { useLocalizedPath } from "@/hooks/common/useLocalizedPath";


const Page = () => {
    const router = useRouter();
    const {clientId} = useParams();
    const { currentLocale } = useLocalizedPath();

    const onSuccess = () => {
        router.push(`/${currentLocale}/clients/${clientId}/incidents`)
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

export default withAuth(
    withPermissions(Page, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.CreateClientIncident, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);