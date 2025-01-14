import React, { FunctionComponent, PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

type Props = {
  title: string;
  header?: React.ReactNode;
  sideActions?: React.ReactNode;
  containerClassName?: string;
  className?: string;
};

const Panel: FunctionComponent<PropsWithChildren<Props>> = ({
  title,
  children,
  sideActions,
  containerClassName,
  header,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
        className
      )}
    >
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark flex justify-between items-center flex-col sm:flex-row">
        {header || (
          <>
            <h3 className="font-medium text-slate-800  dark:text-white">{title}</h3>
            <div>{sideActions}</div>
          </>
        )}
      </div>
      <div className={containerClassName}>{children}</div>
    </div>
  );
};

export default Panel;
