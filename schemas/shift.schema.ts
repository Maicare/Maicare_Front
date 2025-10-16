import { z } from 'zod';

// Zod schema voor createShift
export const createShiftSchema = z.object({
  end_time: z.string().min(1, "Eindtijd is verplicht"),
  location_id: z.number().min(1, "Locatie is verplicht"),
  shift: z.string().min(1, "Dienst is verplicht"),
  start_time: z.string().min(1, "Starttijd is verplicht"),
});

// Type voor createShift (geïnferreerd van het schema)
export type CreateShift = z.infer<typeof createShiftSchema>;

// Zod schema voor Shift (createShift met id)
export const shiftSchema = createShiftSchema.extend({
  id: z.number(),
});

// Type voor Shift (geïnferreerd van het schema)
export type Shift = z.infer<typeof shiftSchema>;