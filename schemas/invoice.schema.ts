// schemas/invoice.ts
import { z } from "zod";

const periodSchema = z.object({
  accommodation_time_frame: z.string().optional(),
  ambulante_total_minutes: z.number().optional(),
  end_date: z.string(),
  start_date: z.string(),
});

const invoiceDetailSchema = z.object({
  contract_id: z.number(),
  contract_name: z.string(),
  periods: z.array(periodSchema),
  pre_vat_total_price: z.number(),
  price: z.number(),
  price_time_unit: z.string(),
  total_price: z.number(),
  vat: z.number(),
  warnings: z.array(z.string()),
});

export const updateInvoiceSchema = z.object({
  due_date: z.string(),
  extra_content: z.string(),
  invoice_details: z.array(invoiceDetailSchema),
  issue_date: z.string(),
  status: z.string(),
  total_amount: z.number(),
  warning_count: z.number().optional(),
});

export type UpdateInvoiceFormValues = z.infer<typeof updateInvoiceSchema>;