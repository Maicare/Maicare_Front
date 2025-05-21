import { z } from 'zod';

// Zod schema
export const appointmentSchema = z.object({
  client_ids: z.array(z.number()).min(1, "At least one client ID is required"),
  description: z.string().min(1, "Description is required"),
  end_time: z.string().datetime().or(z.date()),
  location: z.string().min(1, "Location is required"),
  participant_employee_ids: z.array(z.number()).min(1, "At least one participant is required"),
  recurrence_end_date: z.string().datetime().or(z.date()),
  recurrence_interval: z.number().int().nonnegative(),
  recurrence_type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'NONE']),
  start_time: z.string().datetime().or(z.date())
}).refine(data => new Date(data.start_time) < new Date(data.end_time), {
  message: "End time must be after start time",
  path: ["end_time"]
});

// Infer the TypeScript type from Zod schema
export type CreateAppointmentType = z.infer<typeof appointmentSchema>;

// Optional: Helper function to parse dates if using string format
function parseEventDates(input: Omit<CreateAppointmentType, 'start_time' | 'end_time' | 'recurrence_end_date'> & {
  start_time: string;
  end_time: string;
  recurrence_end_date: string;
}): CreateAppointmentType {
  return {
    ...input,
    start_time: new Date(input.start_time),
    end_time: new Date(input.end_time),
    recurrence_end_date: new Date(input.recurrence_end_date)
  };
}

// Usage example:
const sampleEvent = {
  client_ids: [0],
  description: "string",
  end_time: "2023-10-01T11:00:00Z",
  location: "string",
  participant_employee_ids: [0],
  recurrence_end_date: "2025-10-01T10:00:00Z",
  recurrence_interval: 0,
  recurrence_type: "weekly",
  start_time: "2023-10-01T10:00:00Z"
};

// const parsed = eventSchema.parse(sampleEvent); // Zod validation
// const withDates = parseEventDates(sampleEvent); // Convert to Date objects