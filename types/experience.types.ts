import { Id } from "@/common/types/types";


export type Experience = {
    id: Id;
    employee_id: Id;
    company_name: string;
    description: string;
    end_date: string;
    job_title: string;
    start_date: string;
}

export type CreateExperience = {
    company_name: string,
    description: string,
    employee_id: Id,
    end_date: string,
    job_title: string,
    start_date: string
};
export const initialValues: CreateExperience = {
    company_name: "",
    description: "",
    employee_id: 0,
    end_date: "",
    job_title: "",
    start_date: ""
};