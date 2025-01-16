import { ButtonHTMLAttributes } from "react";

export type ButtonType =
    | "Primary"
    | "Secondary"
    | "Success"
    | "Dark"
    | "Light"
    | "Gray"
    | "Danger"
    | "Warning"
    | "Outline"
    | "Info";
export type IconButtonType = 
    | "Primary"
    | "Secondary"
    | "Success"
    | "Outline"
    | "Danger"

export const ICON_BUTTON_TYPE: string[] = ["Primary", "Secondary", "Success", "Outline"];

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
    loadingText?: string;
    buttonType?: IconButtonType;
};