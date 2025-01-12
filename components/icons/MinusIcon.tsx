import React, { FunctionComponent } from "react";
import { IconProps } from "@/types/IconProps";
import { cn } from "@/utils/cn";

const MinusIcon: FunctionComponent<IconProps> = (props) => {
  return (
    <svg
      className={cn("fill-current", props.className)}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.4375 10.7187H1.5625C1.1875 10.7187 0.84375 10.4062 0.84375 10C0.84375 9.625 1.15625 9.28125 1.5625 9.28125H18.4375C18.8125 9.28125 19.1562 9.59375 19.1562 10C19.1562 10.375 18.8125 10.7187 18.4375 10.7187Z"
        fill=""
      />
    </svg>
  );
};

export default MinusIcon;
