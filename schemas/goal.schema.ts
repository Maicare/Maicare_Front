import { CreateObjective } from "@/types/goals.types";
import * as Yup from "yup";

export const CreateObjectiveSchema: Yup.ObjectSchema<CreateObjective> = Yup.object().shape({
    due_date: Yup.string().required("Einddatum is verplicht"),
    objective_description: Yup.string().required("Beschrijving is verplicht"),
});

import { z } from "zod";

export const createGoalSchema = z.object({
  description: z.string({
    required_error: "Beschrijving is verplicht",
    invalid_type_error: "Beschrijving moet een tekst zijn"
  })
  .min(1, "Beschrijving mag niet leeg zijn")
  .max(500, "Beschrijving mag niet langer zijn dan 500 tekens"),

  start_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
    message: "Startdatum is verplicht",
  }),

  target_date: z.coerce.date().refine(date => !isNaN(date.getTime()), {
    message: "Einddatum is verplicht",
  }),

  target_level: z.string({
    required_error: "Doelniveau is verplicht",
    invalid_type_error: "Doelniveau moet een tekst zijn"
  })
  .min(1, "Doelniveau mag niet leeg zijn"),

  status: z.string({
    required_error: "Status is verplicht",
    invalid_type_error: "Status moet een tekst zijn"
  })
  .min(1, "Status mag niet leeg zijn")
});

export type CreateGoal = z.infer<typeof createGoalSchema>;