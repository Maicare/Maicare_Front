"use client";

import { useParams, useRouter } from "next/navigation";
import UpsertDiagnosisForm from "./_components/UpsertDiagnosisForm";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const CreateDiagnosisPage = () => {
    const router = useRouter();
    const { clientId } = useParams();

    const onSuccess = () => {
        router.push(`/clients/${clientId}/medical-record`)
    }
    const onCancel = () => {
        router.back();
    }
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Nieuwe Diagnose</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Nieuwe Diagnose</span></p>
            </div>
            <UpsertDiagnosisForm
                mode="create"
                onSuccess={onSuccess}
                onCancel={onCancel}
                clientId={clientId as string}
            />
        </div>
    )
}

export default withAuth(
  withPermissions(CreateDiagnosisPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.CreateClientDiagnosis, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );