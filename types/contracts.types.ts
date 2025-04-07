import { PaginatedResponse } from "@/common/types/pagination.types";

export const RATE_TYPE_ARRAY = ["daily", "minute", "hourly", "weekly", "monthly"] as const;

export type RateType = (typeof RATE_TYPE_ARRAY)[number];

export type CareType = "ambulante" | "accommodation";

export type ContractStatus = "draft" | "approved" | "terminated";

export const HOURS_TERM_TYPES = ["week", "all_period"] as const;
export type HoursTermType = (typeof HOURS_TERM_TYPES)[number];

export const FINANCING_OPTION_TYPES = ["ZIN", "PGB"] as const;
export type FinancingOptionType = (typeof FINANCING_OPTION_TYPES)[number];

export const FINANCING_LAW_TYPES = ["WMO", "ZVW", "WLZ", "JW", "WPG"] as const;
export type FinancingLawType = (typeof FINANCING_LAW_TYPES)[number];

export type NewContractReqDto = {
    client_id: number;
    sender_id: number;
    type_id: number;
    attachment_ids: string[];
    price: number;
    price_frequency: RateType;
    care_type: CareType;
    start_date: string;
    end_date: string;
    reminder_period: number; // in days
    tax: number;
    care_name: string;
    status: ContractStatus;
    financing_act: FinancingLawType;
    financing_option: FinancingOptionType;
    hours_type: HoursTermType;
    hours: number;
};

export type AttachmentItem = {
    id: string;
    name: string;
    file: string;
    attachment?: string; // like file field due to inconsistent backend
    attachement?: string; // typo in the backend
    tag?: string;
};

export type DepartureEntries = {
    status: string;
    schedueled: boolean;
    schedueled_for: string;
    reason: string;
};


export type ContractResDto = Omit<NewContractReqDto, "attachment_ids" | "type_id"> & {
    id: number;
    type: number;
    type_id: number;
    attachments: AttachmentItem[];
    attachment_ids?: string[];
    departure_reason?: string;
    departure_report?: string;
} & Partial<DepartureEntries>;


export type ContractItem = Pick<
    ContractResDto,
    | "id"
    | "start_date"
    | "end_date"
    | "care_type"
    | "client_id"
    | "price_frequency"
    | "price"
    | "status"
> & {
    client_first_name: string;
    client_last_name: string;
    client_email: string;
    sender_name: string;
};

export type ContractsListDto = PaginatedResponse<ContractItem>;

export type ContractFilterFormType = {
    search: string,
    status: string,
    care_type: string,
    financing_act: string,
    financing_option: string,
    location_id?: string,
    page_size?: number,
};

export type ContractTypeItem = {
    id?: number;
    value?: number;
    name?: string;
    label?: string;
};

export type ContractTypesResDto = ContractTypeItem[];

export type ContractTypeCreateReqDto = {
    name: string;
};

export type ContractFormType = {
    // start_date: string;
    // end_date: string;
    // care_type: string;
    // price_frequency: RateType | "";
    // price: string;
    // attachment_ids: string[];
    // reminder_period: string;
    // tax: string;
    // care_name: string;
    // type_id: string;
    // financing_act: FinancingLawType | "";
    // financing_option: FinancingOptionType | "";
    // hours_type: HoursTermType | "";
    // hours: string;
    // sender_id?: number;
    start_date: string;
    end_date: string;
    care_type: "ambulante" | "accommodation" | "";
    price_frequency: RateType | "";
    price: string;
    attachment_ids: string[];
    reminder_period: string;
    tax: string;
    care_name: string;
    type_id: string;
    financing_act: FinancingLawType | "";
    financing_option: FinancingOptionType | "";
    hours_type: HoursTermType | "";
    hours: string;
    sender_id?: number;
};