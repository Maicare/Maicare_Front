import { z } from 'zod';

// Zod schema for CreateLocation
export const createLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
});

// Type for CreateLocation (inferred from the schema)
export type CreateLocation = z.infer<typeof createLocationSchema>;

// Zod schema for Location (CreateLocation with id)
export const locationSchema = createLocationSchema.extend({
  id: z.number().int().positive(),
});

// Type for Location (inferred from the schema)
export type Location = z.infer<typeof locationSchema> & {created_at?:string};