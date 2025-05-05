import {  CreateObjective } from "@/types/goals.types";
import * as Yup from "yup";
// export const CreateGoalSchema: Yup.ObjectSchema<CreateGoal> = Yup.object().shape({
//     description: Yup.string().required("Geef alstublieft een beschrijving"),
//     start_date: Yup.string().required("Geef alstublieft een startdatum"),
//     status: Yup.string().required("Geef alstublieft een status"),
//     target_date: Yup.string().required("Geef alstublieft een einddatum"),
//     target_level: Yup.string().required("Geef alstublieft een doelniveau"),
// });

export const CreateObjectiveSchema: Yup.ObjectSchema<CreateObjective> = Yup.object().shape({
    due_date: Yup.string().required("Geef alstublieft een einddatum"),
    objective_description: Yup.string().required("Geef alstublieft een beschrijving"),
});

import { z } from "zod";

export const createGoalSchema = z.object({
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string"
  })
  .min(1, "Description cannot be empty")
  .max(500, "Description cannot exceed 500 characters"),

  start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
    message: "Geboortedatum is vereist", // Invalid date format
}),

  target_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
    message: "Geboortedatum is vereist", // Invalid date format
}),

  target_level: z.string({
    required_error: "Target level is required",
    invalid_type_error: "Target level must be a string"
  })
  .min(1, "Target level cannot be empty"),

  status: z.string({
    required_error: "Status is required",
    invalid_type_error: "Status must be a string"
  })
  .min(1, "Status cannot be empty")
});

export type CreateGoal = z.infer<typeof createGoalSchema>;