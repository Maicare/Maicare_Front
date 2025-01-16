import { Permission } from "@/common/types/permission.types"
import { Id } from "@/common/types/types"

export type Employee = {
    user_id: Id,
    employee_id: Id,
    first_name: string,
    last_name: string,
    email: string,
    role_id: Id,
    permissions: Permission[],
}

export type EmployeeList = {
    id: Id,
    user_id: Id,
    first_name: string,
    last_name: string,
    position: string,
    department: string,
    employee_number: string,
    employment_number: string,
    private_email_address: string,
    email: string,
    authentication_phone_number: string,
    private_phone_number: string,
    work_phone_number: string,
    date_of_birth: string,
    home_telephone_number: string,
    created_at: string,
    is_subcontractor: boolean,
    gender: string,//TODO: Change to enum
    location_id: Id,
    has_borrowed: boolean,
    out_of_service: boolean,
    is_archived: boolean,
    profile_picture: string
}
export type EmployeesSearchParams = {
    search?: string;
    position?: string;
    department?: string;
    out_of_service?: boolean;
    location_id?: Id;
    is_archived?: boolean;
    page: number;
    page_size: number;
};
export type EmployeeDetailsResponse = {
    id: Id,
    user_id: Id,
    first_name: string,
    last_name: string,
    position: string,
    department: string,
    employee_number: string,
    employment_number: string,
    private_email_address: string,
    email: string,
    authentication_phone_number: string,
    private_phone_number: string,
    work_phone_number: string,
    date_of_birth: string,
    home_telephone_number: string,
    created_at: string,
    is_subcontractor: boolean,
    gender: string,//TODO: Change to enum
    location_id: Id,
    has_borrowed: boolean,
    out_of_service: boolean,
    is_archived: boolean,
    profile_picture: string
}
=======

export type EmployeeForm = {
    id?: number;
    employee_number: string;
    employment_number: string;
    is_subcontractor: boolean;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    email: string;
    private_email_address: string;
    authentication_phone_number: string;
    work_phone_number: string;
    private_phone_number: string;
    home_telephone_number: string;
    location_id: string | number;
    role_id: string | number;
    out_of_service: boolean;
};
