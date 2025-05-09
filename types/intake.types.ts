export type GuardianDetailsType = {
    address: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
};

export type IntakeFormType = {
    addiction_issues: boolean;
    address: string;
    bsn: string;
    city: string;
    client_signature: boolean;
    current_school: string;
    date_of_birth: string;
    diagnoses: string;
    email: string;
    first_name: string;
    gender: string;
    guardian_details: GuardianDetailsType[];
    guardian_signature: boolean;
    guidance_goals: string;
    has_valid_indication: boolean;
    id_number: string;
    id_type: string;
    indication_end_date: string;
    indication_start_date: string;
    judicial_involvement: boolean;
    last_name: string;
    law_type: string;
    living_situation: string;
    main_provider_contact: string;
    main_provider_name: string;
    medication_details: string;
    mentor_email: string;
    mentor_name: string;
    mentor_phone: string;
    nationality: string;
    other_law_specification: string;
    other_living_situation: string;
    other_risks: string;
    parental_authority: boolean;
    phone_number: string;
    postal_code: string;
    previous_care: string;
    referrer_email: string;
    referrer_function: string;
    referrer_name: string;
    referrer_organization: string;
    referrer_phone: string;
    referrer_signature: boolean;
    registration_reason: string;
    registration_type: string;
    risk_aggression: boolean;
    risk_drug_dealing: boolean;
    risk_running_away: boolean;
    risk_self_harm: boolean;
    risk_suicidality: boolean;
    risk_weapon_possession: boolean;
    sharing_permission: boolean;
    signature_date: string;
    signed_by: string;
    truth_declaration: boolean;
    uses_medication: boolean;
    attachement_ids?: string[]; // Optional fields
    created_at?: string;
    urgency_score?: number;
    id?: string;
    time_since_submission?: string;
};

export type IntakeSearchParams = {
    search?: string;
    sort_by?: string;
    page: number;
    page_size: number;
}