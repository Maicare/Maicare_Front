import { z } from "zod";

export const createPaymentSchema = z.object({
  amount: z.number().min(0, { message: "Amount must be a non-negative number" }),
  notes: z.string().optional(),
  recorded_by: z.number().optional(),
  payment_date: z.coerce.date(), // Accepts ISO strings or Date objects
  payment_method: z.enum(['bank_transfer', 'credit_card', 'check', 'cash', 'other']), // Extendable
  payment_reference: z.string().min(1, { message: "Payment reference is required" }),
  payment_status: z.enum(['completed', 'pending', 'failed', 'reversed', 'refunded']), // Extendable
});

// Inferred TypeScript type
export type CreatePayment = z.infer<typeof createPaymentSchema>;
