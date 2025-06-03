import { RecurrenceType } from '@/types/calendar.types';
import { z } from 'zod';

// Zod schema
export const appointmentSchema = z
  .object({
    client_ids: z
      .array(z.number())
      .min(1, "Please select at least one client."),

    participant_employee_ids: z
      .array(z.number())
      .min(1, "Please select at least one participant."),

    description: z
      .string()
      .min(1, "Please enter a description for this appointment."),

    location: z
      .string()
      .min(1, "Please choose a location."),

    start_time: z.union([
      z.string().datetime({ message: "Please pick a valid start date & time." }),
      z.date(),
    ]),
    end_time: z.union([
      z.string().datetime({ message: "Please pick a valid end date & time." }),
      z.date(),
    ]),

    recurrence_type: z
      .nativeEnum(RecurrenceType, {
        required_error: "Please select a recurrence pattern.",
      }),
    recurrence_interval: z
      .number()
      .int({ message: "Recurrence interval must be a whole number." })
      .nonnegative({ message: "Recurrence interval cannot be negative." }),
    recurrence_end_date: z.union([
      z.string().datetime({ message: "Please pick a valid recurrence end date." }),
      z.date(),
    ]),

    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a hex code like #4f46e5")
      .optional(),
  })
  .refine(
    (data) => new Date(data.start_time) < new Date(data.end_time),
    {
      message: "Please ensure the end time is after the start time.",
      path: ["end_time"],
    }
  );

export type CreateAppointmentType = z.infer<typeof appointmentSchema>;

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