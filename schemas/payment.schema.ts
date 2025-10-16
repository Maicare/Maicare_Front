import { z } from "zod";

export const createPaymentSchema = z.object({
  amount: z.number().min(0, { message: "Bedrag moet een positief getal zijn" }),
  notes: z.string().optional(),
  recorded_by: z.number().optional(),
  payment_date: z.coerce.date(), // Accepteert ISO strings of Date objecten
  payment_method: z.enum(['bank_transfer', 'credit_card', 'check', 'cash', 'other']), // Uitbreidbaar
  payment_reference: z.string().min(1, { message: "Betalingsreferentie is verplicht" }),
  payment_status: z.enum(['completed', 'pending', 'failed', 'reversed', 'refunded']), // Uitbreidbaar
});

// Geïnferreerd TypeScript type
export type CreatePayment = z.infer<typeof createPaymentSchema>;