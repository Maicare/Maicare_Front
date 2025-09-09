import { Id } from "@/common/types/types";

export type Organization = {
    address: string,
    btw_number: string,
    city: string,
    email: string,
    id: Id,
    kvk_number: string,
    location_count: number,
    name: string,
    postal_code: string
};
