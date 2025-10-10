"use client";

import { useRouter } from "next/navigation";
import UpsertEmployeeForm from "../_components/UpsertEmployeeForm";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";


const Page = () => {
    const router = useRouter();

    const onSuccess = (id:number) => {
        router.push(`/employee/${id}`)
    }
    const onCancel = () => {
        router.back();
    }
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Medewerker Aanmaken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Medewerker Aanmaken</span></p>
            </div>
            <UpsertEmployeeForm
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
    requiredPermissions: PermissionsObjects.CreateEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );