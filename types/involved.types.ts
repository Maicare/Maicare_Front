export type InvolvedEmployeesSearchParams = {
    search?: string;
    page: number;
    page_size: number;
    clientId: string;
};

export type InvolvedEmployeeList = {
    client_id: number;
    created_at: string;
    employee_id: number;
    employee_name?: string;
    id: number;
    role: string;
    start_date: string;
}

export type InvolvedEmployeeForm = {
    employee_id: number,
    role: string,
    start_date: string
};
