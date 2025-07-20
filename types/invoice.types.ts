import { Id } from "@/common/types/types";

export interface Period {
    accommodation_time_frame: string;
    ambulante_total_minutes: number;
    end_date: string;
    start_date: string;
}

export interface InvoiceDetail {
    contract_id: number;
    periods: Period[];
    pre_vat_total_price: number;
    price: number;
    price_time_unit: string;
    total_price: number;
    vat: number;
    warnings: string[];
}

export interface Invoice {
    client_id: number;
    created_at: string;
    due_date: string;
    extra_content: string;
    id: number;
    invoice_details: InvoiceDetail[];
    invoice_number: string;
    issue_date: string;
    pdf_attachment_id: string;
    sender_id: number;
    status: string;
    total_amount: number;
    updated_at: string;
}
export type CreateInvoice = {
    client_id:Id;
    end_date:string;
    start_date:string;
}