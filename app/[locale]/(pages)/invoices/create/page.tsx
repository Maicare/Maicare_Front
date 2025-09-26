// app/invoices/[id]/edit/page.tsx
"use client";

import { useInvoice } from "@/hooks/invoice/use-invoive";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { UpdateInvoiceFormValues } from "@/schemas/invoice.schema";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { CreateInvoiceForm } from "../_components/create-invoice-form";

function CreateInvoicePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams.get("clientId");
    const { createOne } = useInvoice({ autoFetch: false });
    const [isPending, setIsPending] = useState(false);
    if (!clientId) {
        router.push("/invoices");
        return null;
    }


    const handleSubmit = async (values: UpdateInvoiceFormValues) => {
        try {
            setIsPending(true);
            await createOne(
                values,
                {
                    displayProgress: true,
                    displaySuccess: true,
                }
            );
            router.back();
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Update Invoice</h1>
            <CreateInvoiceForm
                onSubmit={handleSubmit}
                isSubmitting={isPending}
                clientId={clientId}
            />
        </div>
    );
}

export default withAuth(
    withPermissions(CreateInvoicePage, {
        redirectUrl: Routes.Common.NotFound,
        requiredPermissions: PermissionsObjects.CreateInvoice, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);