import { z } from "zod";

export const scheduleSchema = z
  .discriminatedUnion("is_custom", [
    z.object({
      is_custom: z.literal(true),
      employee_id: z
        .coerce.number({ invalid_type_error: "Please select an employee." })
        .int()
        .gt(0, { message: "Please select an employee." }),
      location_id: z
        .coerce.number({ invalid_type_error: "Please select a location." })
        .int()
        .gt(0, { message: "Please select a location." }),
      start_datetime: z.union([
        z.string().datetime({ message: "Please pick a valid start date & time." }),
        z.date(),
      ]),
      end_datetime: z.union([
        z.string().datetime({ message: "Please pick a valid end date & time." }),
        z.date(),
      ]),
    }),
    z.object({
      is_custom: z.literal(false),
      employee_id: z
        .coerce.number({ invalid_type_error: "Please select an employee." })
        .int()
        .gt(0, { message: "Please select an employee." }),
      location_id: z
        .coerce.number({ invalid_type_error: "Please select a location." })
        .int()
        .gt(0, { message: "Please select a location." }),
      location_shift_id: z
        .coerce.number({ invalid_type_error: "Please select a shift." })
        .int()
        .gt(0, { message: "Please select a shift." }),
      shift_date: z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), { message: "Please pick a valid shift date." }),
    }),
  ])
  .refine((d) => {
    if (d.is_custom) {
      return new Date(d.start_datetime) < new Date(d.end_datetime);
    }
    return true;
  }, {
    message: "Please ensure the end date/time is after the start date/time.",
    path: ["end_datetime"],
  });

export type CreateScheduleType = z.infer<typeof scheduleSchema>;

export function parseScheduleDates(input: any): CreateScheduleType {
  if (input.is_custom) {
    return {
      is_custom: true,
      employee_id: Number(input.employee_id),
      location_id: Number(input.location_id),
      start_datetime: new Date(input.start_datetime),
      end_datetime: new Date(input.end_datetime),
    };
  } else {
    return {
      is_custom: false,
      employee_id: Number(input.employee_id),
      location_id: Number(input.location_id),
      location_shift_id: Number(input.location_shift_id),
      shift_date: input.shift_date,
    };
  }
}
