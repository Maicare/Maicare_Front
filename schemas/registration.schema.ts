import { z } from 'zod';

// TypeScript interface
export interface RegistrationForm {
  application_date: string;
  care_ambulatory_guidance: boolean;
  care_assisted_independent_living: boolean;
  care_protected_living: boolean;
  care_room_training_center: boolean;
  client_bsn_number: string;
  client_city: string;
  client_email: string;
  client_first_name: string;
  client_gender: string;
  client_house_number: string;
  client_last_name: string;
  client_nationality: string;
  client_phone_number: string;
  client_postal_code: string;
  client_street: string;
  document_diagnosis: string;
  document_education_report: string;
  document_id_copy: string;
  document_psychiatric_report: string;
  document_referral: string;
  document_safety_plan: string;
  education_additional_notes: string;
  education_currently_enrolled: boolean;
  education_institution: string;
  education_mentor_email: string;
  education_mentor_name: string;
  education_mentor_phone: string;
  guardian1_email: string;
  guardian1_first_name: string;
  guardian1_last_name: string;
  guardian1_phone_number: string;
  guardian1_relationship: string;
  guardian2_email: string;
  guardian2_first_name: string;
  guardian2_last_name: string;
  guardian2_phone_number: string;
  guardian2_relationship: string;
  referrer_email: string;
  referrer_first_name: string;
  referrer_job_title: string;
  referrer_last_name: string;
  referrer_organization: string;
  referrer_phone_number: string;
  referrer_signature: boolean;
  risk_additional_notes: string;
  risk_aggressive_behavior: boolean;
  risk_criminal_history: boolean;
  risk_day_night_rhythm: boolean;
  risk_flight_behavior: boolean;
  risk_other: boolean;
  risk_other_description: string;
  risk_psychiatric_issues: boolean;
  risk_sexual_behavior: boolean;
  risk_substance_abuse: boolean;
  risk_suicidal_selfharm: boolean;
  risk_weapon_possession: boolean;
  work_additional_notes: string;
  work_current_employer: string;
  work_current_position: string;
  work_currently_employed: boolean;
  work_employer_email: string;
  work_employer_phone: string;
  work_start_date: string;
}

// Zod schema
export const createRegistrationSchema = z.object({
  application_date: z.string().min(1, "Application date is required"),
  care_ambulatory_guidance: z.boolean().default(false),
  care_assisted_independent_living: z.boolean().default(false),
  care_protected_living: z.boolean().default(false),
  care_room_training_center: z.boolean().default(false),
  client_bsn_number: z.string().min(1, "BSN number is required"),
  client_city: z.string().min(1, "City is required"),
  client_email: z.string().email("Invalid email address").min(1, "Email is required"),
  client_first_name: z.string().min(1, "First name is required"),
  client_gender: z.string().min(1, "Gender is required"),
  client_house_number: z.string().min(1, "House number is required"),
  client_last_name: z.string().min(1, "Last name is required"),
  client_nationality: z.string().min(1, "Nationality is required"),
  client_phone_number: z.string().min(1, "Phone number is required"),
  client_postal_code: z.string().min(1, "Postal code is required"),
  client_street: z.string().min(1, "Street is required"),
  document_diagnosis: z.string().optional(),
  document_education_report: z.string().optional(),
  document_id_copy: z.string().optional(),
  document_psychiatric_report: z.string().optional(),
  document_referral: z.string().optional(),
  document_safety_plan: z.string().optional(),
  education_additional_notes: z.string().optional(),
  education_currently_enrolled: z.boolean().default(false),
  education_institution: z.string().optional(),
  education_mentor_email: z.string().email("Invalid mentor email").optional(),
  education_mentor_name: z.string().optional(),
  education_mentor_phone: z.string().optional(),
  education_level: z.enum(["primary", "secondary", "higher", "none"]).optional(),
  guardian1_email: z.string().email("Invalid guardian email").optional(),
  guardian1_first_name: z.string().optional(),
  guardian1_last_name: z.string().optional(),
  guardian1_phone_number: z.string().optional(),
  guardian1_relationship: z.string().optional(),
  guardian2_email: z.string().email("Invalid guardian email").optional(),
  guardian2_first_name: z.string().optional(),
  guardian2_last_name: z.string().optional(),
  guardian2_phone_number: z.string().optional(),
  guardian2_relationship: z.string().optional(),
  referrer_email: z.string().email("Invalid referrer email").min(1, "Referrer email is required"),
  referrer_first_name: z.string().min(1, "Referrer first name is required"),
  referrer_job_title: z.string().min(1, "Job title is required"),
  referrer_last_name: z.string().min(1, "Referrer last name is required"),
  referrer_organization: z.string().min(1, "Organization is required"),
  referrer_phone_number: z.string().min(1, "Phone number is required"),
  referrer_signature: z.boolean().default(false),
  risk_additional_notes: z.string().optional(),
  risk_aggressive_behavior: z.boolean().default(false),
  risk_criminal_history: z.boolean().default(false),
  risk_day_night_rhythm: z.boolean().default(false),
  risk_flight_behavior: z.boolean().default(false),
  risk_other: z.boolean().default(false),
  risk_other_description: z.string().optional(),
  risk_psychiatric_issues: z.boolean().default(false),
  risk_sexual_behavior: z.boolean().default(false),
  risk_substance_abuse: z.boolean().default(false),
  risk_suicidal_selfharm: z.boolean().default(false),
  risk_weapon_possession: z.boolean().default(false),
  work_additional_notes: z.string().optional(),
  work_current_employer: z.string().optional(),
  work_current_position: z.string().optional(),
  work_currently_employed: z.boolean().default(false),
  work_employer_email: z.string().optional(),
  work_employer_phone: z.string().optional(),
  work_start_date: z.string().optional()
});

// Infer TypeScript type from Zod schema
export type CreateRegistrationType = z.infer<typeof createRegistrationSchema>;