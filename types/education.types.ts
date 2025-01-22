import { Id } from "@/common/types/types"

export type Education = {
    id: Id,
    employee_id: Id;
    institution_name: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
}
export type CreateEducation = {
    employee_id: Id;
    institution_name: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
}
export const initialValues: CreateEducation = {
    institution_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    employee_id: 0
};
