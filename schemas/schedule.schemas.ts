import { z } from "zod";

export const scheduleSchema = z
  .object({
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
  })
  .refine(
    (d) => new Date(d.start_datetime) < new Date(d.end_datetime),
    {
      message: "Please ensure the end date/time is after the start date/time.",
      path: ["end_datetime"],
    }
  );

export type CreateScheduleType = z.infer<typeof scheduleSchema>;

export function parseScheduleDates(input: {
  employee_id: number;
  location_id: number;
  start_datetime: string;
  end_datetime: string;
}): CreateScheduleType {
  return {
    employee_id: input.employee_id,
    location_id: input.location_id,
    start_datetime: new Date(input.start_datetime),
    end_datetime: new Date(input.end_datetime),
  };
}
