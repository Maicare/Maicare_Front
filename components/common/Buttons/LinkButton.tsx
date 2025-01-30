import React, { FunctionComponent } from "react";
import Link from "next/link";
import clsx from "clsx";

type Props = {
  text: string;
  href: string;
  className?: string;
  target?: string;
  icon?: React.ReactNode;
  onClick?:()=>void;
};

const LinkButton: FunctionComponent<Props> = ({ text, href, target, className, icon,onClick }) => {
  return (
    <Link
      href={href}
      target={target}
      onClick={()=>onClick?.()}
      className={clsx(
        "inline-flex rounded-md items-center justify-center px-5 py-2 font-medium text-center text-white bg-primary hover:bg-opacity-90 lg:px-8 xl:px-10",
        className
      )}
    >
      {icon} {text}
    </Link>
  );
};

export default LinkButton;
