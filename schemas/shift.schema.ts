import { z } from 'zod';

// Zod schema for createShift
export const createShiftSchema = z.object({
  end_time: z.string(),
  location_id: z.number(),
  shift: z.string(),
  start_time: z.string(),
});

// Type for createShift (inferred from the schema)
export type CreateShift = z.infer<typeof createShiftSchema>;

// Zod schema for Shift (createShift with id)
export const shiftSchema = createShiftSchema.extend({
  id: z.number(),
});

// Type for Shift (inferred from the schema)
export type Shift = z.infer<typeof shiftSchema>;