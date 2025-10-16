import { z } from 'zod';

// Zod schema
export const createOrganisationSchema = z.object({
  address: z.string().min(1, "Adres is verplicht"),
  btw_number: z.string().min(1, "BTW-nummer is verplicht"),
  city: z.string().min(1, "Stad is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  kvk_number: z.string().min(1, "KVK-nummer is verplicht"),
  name: z.string().min(1, "Naam is verplicht"),
  postal_code: z.string().min(1, "Postcode is verplicht")
});

// TypeScript type geïnferreerd van Zod schema
export type CreateOrganisation = z.infer<typeof createOrganisationSchema>;