import { z } from "zod";

export const scheduleSchema = z
  .discriminatedUnion("is_custom", [
    z.object({
      is_custom: z.literal(true),
      employee_id: z
        .coerce.string({ invalid_type_error: "Selecteer een medewerker." })
        .uuid(),
      location_id: z
        .coerce.string({ invalid_type_error: "Selecteer een locatie." })
        .uuid(),
      start_datetime: z.union([
        z.string().datetime({ message: "Kies een geldige startdatum & tijd." }),
        z.date(),
      ]),
      end_datetime: z.union([
        z.string().datetime({ message: "Kies een geldige einddatum & tijd." }),
        z.date(),
      ]),
    }),
    z.object({
      is_custom: z.literal(false),
      employee_id: z
        .coerce.string({ invalid_type_error: "Selecteer een medewerker." })
        .uuid(),
      location_id: z
        .coerce.string({ invalid_type_error: "Selecteer een locatie." })
        .uuid(),
      location_shift_id: z
        .coerce.string({ invalid_type_error: "Selecteer een dienst." })
        .uuid(),
      shift_date: z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), { message: "Kies een geldige dienst datum." }),
    }),
  ])
  .refine((d) => {
    if (d.is_custom) {
      return new Date(d.start_datetime) < new Date(d.end_datetime);
    }
    return true;
  }, {
    message: "Zorg ervoor dat de einddatum/tijd na de startdatum/tijd ligt.",
    path: ["end_datetime"],
  });

export type CreateScheduleType = z.infer<typeof scheduleSchema>;

export function parseScheduleDates(input: any): CreateScheduleType {
  if (input.is_custom) {
    return {
      is_custom: true,
      employee_id: input.employee_id,
      location_id: input.location_id,
      start_datetime: new Date(input.start_datetime),
      end_datetime: new Date(input.end_datetime),
    };
  } else {
    return {
      is_custom: false,
      employee_id: input.employee_id,
      location_id: input.location_id,
      location_shift_id: input.location_shift_id,
      shift_date: input.shift_date,
    };
  }
}