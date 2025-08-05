"use client";
import InvoiceDetails from '../_components/invoice-details'
import { InvoicesType } from '../_components/columns';
import { useInvoice } from '@/hooks/invoice/use-invoive';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Id } from '@/common/types/types';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { PermissionsObjects } from '@/common/data/permission.data';

const InvoiceDetailsPage = () => {
  const { readOne,creditOne } = useInvoice({ autoFetch: false });
  const router = useRouter();
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState<InvoicesType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
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
  const handleCredit = async() => {
    try {
      const data = await creditOne(invoiceId as string,{
        displayProgress:true,
        displaySuccess:true
      });
      router.push(data!.id.toString())
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <InvoiceDetails
      invoice={invoice}
      handleCredit={handleCredit}
    />
  )
}
export default withAuth(
  withPermissions(InvoiceDetailsPage, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);