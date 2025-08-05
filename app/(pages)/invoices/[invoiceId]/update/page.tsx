// app/invoices/[id]/edit/page.tsx
"use client";

import { useInvoice } from "@/hooks/invoice/use-invoive";
import { useParams, useRouter } from "next/navigation";
import { UpdateInvoiceForm } from "../../_components/update-invoice-form";
import { useEffect, useState } from "react";
import { InvoicesType } from "../../_components/columns";
import { Id } from "@/common/types/types";
import { UpdateInvoiceFormValues } from "@/schemas/invoice.schema";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

function UpdateInvoicePage() {
  const { invoiceId } = useParams();
  const router = useRouter();
  const {readOne,updateOne} = useInvoice({autoFetch:false});
const [invoice, setInvoice] = useState<InvoicesType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  useEffect(() => {
    const fetchInvoice = async (id: Id) => {
      setIsLoading(true);
      const data = await readOne(id);
      setInvoice(data);
      setIsLoading(false);
    }
    if (invoiceId) fetchInvoice(+invoiceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);
  if (!invoice || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSubmit = async(values:UpdateInvoiceFormValues) => {
    try {
        setIsPending(true);
        await updateOne(
            invoiceId as string,
            values,
            {
                displayProgress: true,
                displaySuccess: true,
            }
        );
        router.back();
    } catch (error) {
        console.error(error);
    }finally{
        setIsPending(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Update Invoice</h1>
      <UpdateInvoiceForm
        defaultValues={invoice}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </div>
  );
}

export default withAuth(
  withPermissions(UpdateInvoicePage, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);