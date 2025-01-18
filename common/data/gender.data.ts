import { SelectionOption } from "../types/selection-option.types";

export const mappingGender: Record<string, string> = {
    male: "Man",
    female: "Vrouw",
    not_specified: "Niet gespecificeerd",
};
export const GENDER_OPTIONS: SelectionOption[] = [
    {
        label: "Man",
        value: "male",
    },
    {
        label: "Vrouw",
        value: "female",
    },
    {
        label: "Niet gespecificeerd",
        value: "not_specified",
    },
];
export const SOURCE_OPTIONS = [
    { label: "Selecteer Bron", value: "" },
    { label: "BRP", value: "BRP" },
    { label: "ID", value: "ID" },
    { label: "Paspoort", value: "passport" },
    { label: "Poliskaart", value: "policy_card" },
    { label: "Brief Overheidsinstantie", value: "government_agency_letter" },
];