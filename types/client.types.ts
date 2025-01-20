import { Id } from "@/common/types/types";

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
};

export type CreateClientInput = {
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
    addresses: AddressType[];
    infix?: string; // Optional fields
    added_identity_documents?: string[]; // Optional fields
    removed_identity_documents?: string[];
    departure_reason?: string;
    departure_report?: string;
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
    addresses: []
};

export type Client = {
    id:Id;
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
}