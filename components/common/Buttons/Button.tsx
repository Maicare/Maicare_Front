import React, { ButtonHTMLAttributes, FunctionComponent } from "react";
import LoadingCircle from "@/components/icons/LoadingCircle";
import { ButtonType } from "@/common/types/button-type.types";
import { BUTTON_CLASS_NAMES } from "@/consts";
import { cn } from "@/utils/cn";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
  buttonType?: ButtonType;
};

const Button: FunctionComponent<ButtonProps> = ({
  isLoading = false,
  children,
  type = "button",
  loadingText,
  buttonType,
  ...props
}) => {
  return (
    <button
      type={type}
      {...props}
      className={cn(
        "flex justify-center px-10 py-2 font-medium rounded-lg hover:bg-opacity-100 bg-opacity-90 cursor-pointer",
        BUTTON_CLASS_NAMES[buttonType ?? "Primary"] ??
          BUTTON_CLASS_NAMES.Primary,
        props.className
        // (props.disabled && "bg-gray-300"),
      )}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">
            <LoadingCircle />
          </span>
          <span className="ml-2">{loadingText ?? "Bezig met laden..."}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
