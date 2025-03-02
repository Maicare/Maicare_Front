import { CreateGoal, CreateObjective } from "@/types/goals.types";
import * as Yup from "yup";
export const CreateGoalSchema: Yup.ObjectSchema<CreateGoal> = Yup.object().shape({
    description: Yup.string().required("Geef alstublieft een beschrijving"),
    start_date: Yup.string().required("Geef alstublieft een startdatum"),
    status: Yup.string().required("Geef alstublieft een status"),
    target_date: Yup.string().required("Geef alstublieft een einddatum"),
    target_level: Yup.string().required("Geef alstublieft een doelniveau"),
});

export const CreateObjectiveSchema: Yup.ObjectSchema<CreateObjective> = Yup.object().shape({
    due_date: Yup.string().required("Geef alstublieft een einddatum"),
    objective_description: Yup.string().required("Geef alstublieft een beschrijving"),
});