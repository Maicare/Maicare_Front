export type Appointment = {
    client_id?: number,
    created_at?: string,
    general_information: string[],
    household_info: string[],
    id?: number,
    important_contacts: string[],
    leave: string[],
    organization_agreements: string[],
    school_internship: string[],
    travel: string[],
    smoking_rules: string[],
    treatment_agreements: string[],
    updated_at?: string,
    work: string[],
    youth_officer_agreements: string[]
};