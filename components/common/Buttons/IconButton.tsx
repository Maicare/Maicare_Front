import React, { FunctionComponent } from "react";
import LoadingCircle from "@/components/icons/LoadingCircle";
import { cn } from "@/utils/cn";
import { BUTTON_CLASS_NAMES } from "@/common/data/button.data";
import { ButtonProps } from "@/common/types/button.types";

const IconButton: FunctionComponent<ButtonProps> = ({
  isLoading = false,
  children,
  type = "button",
  buttonType,
  ...props
}) => {
  return (
    <button
      type={type}
      {...props}
      className={cn(
        "flex justify-center p-2 font-medium rounded-full",
        BUTTON_CLASS_NAMES[buttonType  ?? "Primary"] ?? BUTTON_CLASS_NAMES.Primary,
        props.className
      )}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">
            <LoadingCircle className={"w-5 h-5"} />
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default IconButton;
