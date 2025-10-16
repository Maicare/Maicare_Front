import { z } from 'zod';

// Zod schema voor CreateLocation
export const createLocationSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  address: z.string().min(1, "Adres is verplicht"),
  capacity: z.number().int().positive("Capaciteit moet een positief getal zijn"),
  organisation_id: z.string().min(1, "Organisatie ID is verplicht"),
});

// Type voor CreateLocation (geïnferreerd van het schema)
export type CreateLocation = z.infer<typeof createLocationSchema>;

// Zod schema voor Location (CreateLocation met id)
export const locationSchema = createLocationSchema.extend({
  id: z.number().int().positive(),
});

// Type voor Location (geïnferreerd van het schema)
export type Location = z.infer<typeof locationSchema> & {created_at?:string};