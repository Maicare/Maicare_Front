"use client";
import InvoiceDetails from '../_components/invoice-details'
import { InvoicesType } from '../_components/columns';
import { useInvoice } from '@/hooks/invoice/use-invoive';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Id } from '@/common/types/types';

const InvoiceDetailsPage = () => {
  const { readOne } = useInvoice({ autoFetch: false });
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
  return (
    <InvoiceDetails
      invoice={invoice}
    />
  )
}

export default InvoiceDetailsPage