"use client";

import { useRouter } from "next/navigation";
import UpsertClientForm from "../_components/UpsertClientForm";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { useLocalizedPath } from "@/hooks/common/useLocalizedPath";
import { useI18n } from "@/lib/i18n/client";



const Page = () => {
    const router = useRouter();
    const { currentLocale } = useLocalizedPath();
    const t = useI18n();
    const onSuccess = (id:number) => {
        router.push(`/${currentLocale}/clients/${id}/overview`)
    }
    const onCancel = () => {
        router.back();
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">{t("clients.create.client")}</h1>
                <p>{t("dashboard.adminDashboard")} / <span className="font-medium text-indigo-500 hover:cursor-pointer">{t("clients.create.client")}</span></p>
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
    requiredPermissions: PermissionsObjects.CreateClient, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );