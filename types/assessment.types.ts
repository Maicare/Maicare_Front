import { Id } from "@/common/types/types"

export type Assessment = {
    id: Id;
    clientId: Id;
    maturity_matrix_id: Id;
    initial_level: number;
    current_level: number;
    start_date: string;
    end_date: string;
}

export type AssessmentResponse = Assessment & {
    topic_name: string;
    is_active: boolean;
}

export type CreateAssessment = {
    maturity_matrix_id: Id;
    initial_level: number;
    start_date: string;
    end_date: string;
}

