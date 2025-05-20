import { z } from "zod";
import { RecurrenceType } from "@/types/appointment.types";

export const appointmentSchema = z.object({
  client_ids: z
    .array(z.number(), {
      invalid_type_error: "Something went wrong selecting clients."
    })
    .min(1, { message: "Please pick at least one client." }),

  participant_employee_ids: z
    .array(z.number(), {
      invalid_type_error: "Something went wrong selecting participants."
    })
    .min(1, { message: "Please pick at least one participant." }),

  description: z.string({
    required_error: "Tell us briefly what this appointment is for.",
    invalid_type_error: "Please enter a valid description."
  }).max(500, { message: "Keep it under 500 characters, please." }),

  location: z.string({
    required_error: "Where will this take place?",
    invalid_type_error: "Please enter a valid location."
  }).max(200, { message: "Location is too long." }),

  start_time: z.string({
    required_error: "When should it start?",
    invalid_type_error: "That doesn't look like a valid start time."
  }).refine((val) => !isNaN(Date.parse(val)), {
    message: "Please choose a real start time."
  }),

  end_time: z.string({
    required_error: "When should it end?",
    invalid_type_error: "That doesn't look like a valid end time."
  }).refine((val) => !isNaN(Date.parse(val)), {
    message: "Please choose a real end time."
  }),

  recurrence_type: z.nativeEnum(RecurrenceType, {
    required_error: "How often should it repeat?",
    invalid_type_error: "Choose one of: None, Daily, Weekly or Monthly."
  }),

  recurrence_interval: z
    .number({
      required_error: "How many units between repeats?",
      invalid_type_error: "Please enter a number."
    })
    .min(0, { message: "Must be zero or more." }),

  recurrence_end_date: z
    .string({
      invalid_type_error: "That doesn't look like a valid date."
    })
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Please choose a real end date, or leave blank for no end."
    }),
});

export type CreateAppointment = z.infer<typeof appointmentSchema>;
