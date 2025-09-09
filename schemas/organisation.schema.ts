import { z } from 'zod';

// Zod schema
export const createOrganisationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  btw_number: z.string().min(1, "BTW number is required"),
  city: z.string().min(1, "City is required"),
  email: z.string().email("Invalid email address"),
  kvk_number: z.string().min(1, "KVK number is required"),
  name: z.string().min(1, "Name is required"),
  postal_code: z.string().min(1, "Postal code is required")
});

// TypeScript type inferred from Zod schema
export type CreateOrganisation = z.infer<typeof createOrganisationSchema>;