// schemas/invoice.ts
import { z } from "zod";

const periodSchema = z.object({
  accommodation_time_frame: z.string().optional(),
  ambulante_total_minutes: z.number().optional(),
  end_date: z.string().min(1, "Einddatum is verplicht"),
  start_date: z.string().min(1, "Startdatum is verplicht"),
});

const invoiceDetailSchema = z.object({
  contract_id: z.number(),
  contract_name: z.string().min(1, "Contractnaam is verplicht"),
  periods: z.array(periodSchema),
  pre_vat_total_price: z.number(),
  price: z.number(),
  price_time_unit: z.string().min(1, "Prijs tijdseenheid is verplicht"),
  total_price: z.number(),
  vat: z.number(),
  warnings: z.array(z.string()),
});

export const updateInvoiceSchema = z.object({
  due_date: z.string().min(1, "Vervaldatum is verplicht"),
  extra_content: z.record(z.string(), z.any()).optional(),
  invoice_details: z.array(invoiceDetailSchema).min(1, "Minimaal één factuurregel is verplicht"),
  issue_date: z.string().min(1, "Factuurdatum is verplicht"),
  status: z.string().min(1, "Status is verplicht"),
  total_amount: z.number(),
  warning_count: z.number().optional(),
  client_id: z.number().optional(),
  invoice_type: z.string().optional(),
});

export type UpdateInvoiceFormValues = z.infer<typeof updateInvoiceSchema>;