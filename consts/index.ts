import { SelectionOption } from "@/types/selection-option.types";

export const BUTTON_CLASS_NAMES = {
  Primary: "bg-primary text-white",
  Secondary: "bg-secondary text-white",
  Danger: "bg-danger text-white",
  Success: "bg-success text-white",
  Outline: "bg-transparent border border-primary text-primary",
  //type error fix for Button.tsx
  Dark: "bg-dark text-white",
  Light: "bg-light text-dark",
  Gray: "bg-gray text-white",
  Warning: "bg-warning text-white",
  Info: "bg-info text-white",
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