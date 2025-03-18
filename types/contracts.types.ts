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
    attachments: AttachmentItem[];
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
    sender: number | null;
    client: number | null;
    care_type: string;
    status: ContractStatus | "";
};