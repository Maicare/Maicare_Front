import { CreateAssessment } from "@/types/assessment.types";
import * as Yup from "yup";
export const AssessmentSchema: Yup.ObjectSchema<CreateAssessment> = Yup.object().shape({
    maturity_matrix_id: Yup.number().required("Geef alstublieft een domein"),
    initial_level: Yup.number().required("Geef alstublieft een niveau"),
    start_date: Yup.string().required("Geef alstublieft een startdatum"),
    end_date: Yup.string().required("Geef alstublieft een einddatum"),
});