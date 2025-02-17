import { SelectionOption } from "@/common/types/selection-option.types";
import { Id } from "@/common/types/types";

export type MaturityMatrix = {
    id: Id;
    topic_name: string;
    level_description: string[];
}

export const LEVEL_OPTIONS:SelectionOption[] = [
    { value: "1", label: "Acute problematiek" },
    { value: "2", label: "Niet zelfredzaam" },
    { value: "3", label: "Beperkt zelfredzaam" },
    { value: "4", label: "Voldoende zelfredzaam" },
    { value: "5", label: "Volledig zelfredzaam" }
];