import { Id } from "@/common/types/types";
import { AttachmentItem } from "./contracts.types";
import { AddressType } from "@/schemas/clientNew.schema";


export type ClientFormType = {
    first_name: string;
    last_name: string;
    email: string;
    organisation: string;
    location: Id;
    legal_measure: string;
    birthplace: string;
    departement: string;
    gender: string;
    filenumber: string;
    phone_number: string;
    bsn: string;
    source: string;
    date_of_birth: string;
    city: string;
    Zipcode: string;
    addresses: AddressType[];
    infix: string;
    streetname: string;
    street_number: string;
    added_identity_documents?: string[];
    removed_identity_documents?: string[];
    departure_reason?: string;
    departure_report?: string;
};

export type CreateClientInput = {
    first_name: string;
    last_name: string;
    email: string;
    organisation_id: Id;
    location_id: Id;
    legal_measure: string;
    birthplace: string;
    departement: string;
    gender: string;
    filenumber: string;
    phone_number: string;
    bsn: string;
    source: string;
    date_of_birth: string;
    addresses: AddressType[];
    infix?: string; // Optional fields
    added_identity_documents?: string[]; // Optional fields
    removed_identity_documents?: string[];
    departure_reason?: string;
    departure_report?: string;
    sender_id: Id;
};


export const initialClientFormValues: ClientFormType = {
    first_name: "",
    last_name: "",
    email: "",
    organisation: "",
    location: "",
    legal_measure: "",
    birthplace: "",
    departement: "",
    gender: "",
    filenumber: "",
    date_of_birth: "",
    phone_number: "",
    city: "",
    Zipcode: "",
    infix: "",
    streetname: "",
    street_number: "",
    bsn: "",
    source: "",
    added_identity_documents: [],
    removed_identity_documents: [],
    addresses: [],
};

export type Client = {
    id: Id;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    location:string;
    organisation:string;
    organisation_id: Id;
    location_id: Id;
    legal_measure: string;
    birthplace: string;
    departement: string;
    gender: string;
    filenumber: string;
    phone_number: string;
    bsn: string;
    source: string;
    date_of_birth: string;
    city: string;
    Zipcode: string;
    addresses: AddressType[];
    infix: string;
    streetname: string;
    street_number: string;
    added_identity_documents?: string[];
    removed_identity_documents?: string[];
    departure_reason?: string;
    departure_report?: string;
    profile_picture?: string;
    sender_id: Id;
    employee_id: Id;
    identity?: boolean;
    status?: string;
    living_situation:string;
    education_level:string;
    location_name:string;
    // work_additional_notes: z.string().optional(),
    //   work_current_employer: z.string().optional(),
    //   work_current_position: z.string().optional(),
    //   work_currently_employed: z.boolean().optional(),
    //   work_employer_email: z.string().optional(),
    //   work_employer_phone: z.string().optional(),
    //   work_start_date: z.coerce.date().refine(date => !isNaN(date.getTime()),{
    //     message: "Startdatum werk is verplicht",
    //   }).optional(),
    //   education_additional_notes: z.string().optional(),
    //   education_currently_enrolled: z.boolean().optional(),
    //   education_institution: z.string().optional(),
    //   education_level: z.enum(["primary", "secondary", "higher","none"]).optional(),
    //   education_mentor_email: z.string().optional(),
    //   education_mentor_name: z.string().optional(),
    //   education_mentor_phone: z.string().optional(),
    //   living_situation: z.enum(["home", "foster_care", "youth_care_institution", "other"]).optional(),
    //   living_situation_notes: z.string().optional(),
    work_additional_notes?:string;
    work_current_employer?:string;
    work_current_position?:string;
    work_currently_employed?:boolean;
    work_employer_email?:string;
    work_employer_phone?:string;
    work_start_date?:string;
    education_additional_notes?:string;
    education_currently_enrolled?:boolean;
    education_institution?:string;
    education_mentor_email?:string;
    education_mentor_name?:string;
    education_mentor_phone?:string;
    living_situation_notes?:string;
}
export type ClientsSearchParams = {
    search?: string;
    status?: string;
    location_id?: Id;
    page: number;
    page_size: number;
}

export type ClientStatusHistoryItem = {
    changed_at: string;
    changed_by: string | null;
    client_id: number;
    id: number;
    new_status: string;
    old_status: string;
    reason: string;
}

export type NewClientsRequest = {
    first_name: string;
    last_name: string;
    email: string;
    organisation: string;
    location: number;
    legal_measure: string;
    addresses: AddressType[];
    birthplace: string;
    departement: string;
    gender: string;
    filenumber: number;
    phone_number: string;
    bsn: string;
    source: string;
    date_of_birth: string;
    city: string;
    Zipcode: string;
    infix: string;
    streetname: string;
    street_number: string;
    identity_attachment_ids: string[];
    departure_reason?: string;
    departure_report?: string;
};

export type ClientDetailsResDto = NewClientsRequest & {
    id: number;
    profile_picture: string;
    identity: boolean;
    sender: number;
    status: "On Waiting List" | "In Care" | "Out Of Care";
    attachments: AttachmentItem[];
    gps_position: string[];
};