"use client";

import { useRouter } from "next/navigation";
import UpsertClientForm from "../_components/UpsertClientForm";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";



const Page = () => {
    const router = useRouter();
    const onSuccess = (id:number) => {
        router.push(`/clients/${id}/overview`)
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
            <UpsertClientForm 
                mode="create"
                onSuccess={onSuccess}
                onCancel={onCancel}
            />
        </div>
    )
}

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );