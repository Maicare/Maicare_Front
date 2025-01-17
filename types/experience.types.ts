import { Id } from "@/common/types/types";


export type Experience = {
    id: Id;
    employee_id: Id;
    company_name: string;
    created_at: string;
    description: string;
    end_date: string;
    job_title: string;
    start_date: string;
}