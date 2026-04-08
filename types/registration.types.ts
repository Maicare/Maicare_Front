export type RegistrationStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'archived';

export type RegistrationStatusUpdateType = {
    status: RegistrationStatus;
    intake_appointment_date?: string;
    intake_appointment_location?: string;
    admission_type?: string;
};

export type RegistrationFormType = {
    client_first_name: string;
    client_last_name: string;
    client_bsn_number: string;
    client_gender: string;
    client_nationality: string;
    client_phone_number: string;
    client_email: string;
    client_street: string;
    client_house_number: string;
    client_postal_code: string;
    client_city: string;

    referrer_first_name: string;
    referrer_last_name: string;
    referrer_organization: string;
    referrer_job_title: string;
    referrer_phone_number: string;
    referrer_email: string;

    guardian1_first_name: string;
    guardian1_last_name: string;
    guardian1_relationship: string;
    guardian1_phone_number: string;
    guardian1_email: string;

    guardian2_first_name?: string;
    guardian2_last_name?: string;
    guardian2_relationship?: string;
    guardian2_phone_number?: string;
    guardian2_email?: string;

    education_institution?: string | null;
    education_mentor_name?: string | null;
    education_mentor_phone?: string | null;
    education_mentor_email?: string | null;
    education_currently_enrolled: boolean;
    education_additional_notes?: string | null;
    education_level?: string | null;

    work_current_employer?: string | null;
    work_employer_phone?: string | null;
    work_employer_email?: string | null;
    work_current_position?: string | null;
    work_currently_employed: boolean;
    work_start_date?: string | null;
    work_additional_notes?: string | null;

    care_protected_living: boolean;
    care_assisted_independent_living: boolean;
    care_room_training_center: boolean;
    care_ambulatory_guidance: boolean;

    risk_aggressive_behavior: boolean;
    risk_suicidal_selfharm: boolean;
    risk_substance_abuse: boolean;
    risk_psychiatric_issues: boolean;
    risk_criminal_history: boolean;
    risk_flight_behavior: boolean;
    risk_weapon_possession: boolean;
    risk_sexual_behavior: boolean;
    risk_day_night_rhythm: boolean;
    risk_other: boolean;
    risk_other_description?: string | null;
    risk_additional_notes?: string | null;

    document_referral?: string | null;
    document_education_report?: string | null;
    document_psychiatric_report?: string | null;
    document_diagnosis?: string | null;
    document_safety_plan?: string | null;
    document_id_copy?: string | null;

    application_date: string;
    referrer_signature: boolean;
};

export type Registration = RegistrationFormType & {
    id: string;
    status: RegistrationStatus;
};
