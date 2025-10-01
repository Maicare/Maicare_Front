import { Id } from "@/common/types/types";
import { AttachmentItem } from "./contracts.types";

export type AddressType = {
    belongs_to?: string;
    address?: string;
    city?: string;
    zip_code?: string;
    phone_number?: string;
};
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
    organisation: string;
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
    location: 0,
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
    organisation: string;
    location: string;
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