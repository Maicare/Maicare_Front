import { RecurrenceType } from '@/types/calendar.types';
import { z } from 'zod';

// Zod schema
export const appointmentSchema = z
  .object({
    client_ids: z
      .array(z.number())
      .min(1, "Selecteer minimaal één cliënt."),

    participant_employee_ids: z
      .array(z.number())
      .min(1, "Selecteer minimaal één deelnemer."),

    description: z
      .string()
      .min(1, "Voer een beschrijving in voor deze afspraak."),

    location: z
      .string()
      .min(1, "Kies een locatie."),

    start_time: z.union([
      z.string().datetime({ message: "Kies een geldige startdatum & tijd." }),
      z.date(),
    ]),
    end_time: z.union([
      z.string().datetime({ message: "Kies een geldige einddatum & tijd." }),
      z.date(),
    ]),

    recurrence_type: z
      .nativeEnum(RecurrenceType, {
        required_error: "Selecteer een herhalingspatroon.",
      }),
    recurrence_interval: z
      .number()
      .int({ message: "Herhalingsinterval moet een heel getal zijn." })
      .nonnegative({ message: "Herhalingsinterval kan niet negatief zijn." }),
    recurrence_end_date: z.union([
      z.string().datetime({ message: "Kies een geldige einddatum voor herhaling." }),
      z.date(),
    ]),

    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Kleur moet een hex code zijn zoals #4f46e5")
      .optional(),
  })
  .refine(
    (data) => new Date(data.start_time) < new Date(data.end_time),
    {
      message: "Zorg ervoor dat de eindtijd na de starttijd ligt.",
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

// Gebruiksvoorbeeld:
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

// const parsed = eventSchema.parse(sampleEvent); // Zod validatie
// const withDates = parseEventDates(sampleEvent); // Converteren naar Date objecten