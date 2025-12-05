import { z } from 'zod';

export const createLocationSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  address: z.string().min(1, "Adres is verplicht"),
  capacity: z.number().int().positive("Capaciteit moet een positief getal zijn"),
  organisation_id: z.string().uuid().min(1, "Organisatie ID is verplicht"),
});

export type CreateLocation = z.infer<typeof createLocationSchema>;

export const locationSchema = createLocationSchema.extend({
  id: z.string().uuid(),
  occupied: z.number().int().nonnegative(),
  available: z.number().int().nonnegative(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Location = z.infer<typeof locationSchema>;
