export type EmergencyContactsSearchParams = {
    search?: string;
    page: number;
    page_size: number;
    clientId: string;
};

export type EmergencyContactList = {
    address: string;
    client_id: number;
    created_at: string;
    email: string;
    first_name: string;
    goals_reports: boolean;
    id: number;
    incidents_reports: boolean;
    is_verified: boolean;
    last_name: string;
    medical_reports: boolean;
    phone_number: string;
    relation_status: string;
    relationship: string;
}

export type EmergencyContactForm = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    relationship: string;
    relation_status: string;
    address: string;
    medical_reports: boolean;
    goals_reports: boolean;
    incidents_reports: boolean;
};