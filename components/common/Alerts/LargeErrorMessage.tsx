import React, { FunctionComponent } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

type Props = {
  firstLine: string;
  secondLine: string;
  className?: string;
};
const LargeErrorMessage: FunctionComponent<Props> = ({ firstLine, secondLine,className }) => {
  return (
    <div className={cn("rounded-sm bg-white px-5 py-5 dark:border-strokedark dark:bg-boxdark sm:py-5", className)}>
      <div className="mx-auto max-w-[410px]">
        <Image
          src={"/images/illustration/illustration-01.svg"}
          alt="illustration"
          width={400}
          height={400}
        />

        <div role="alert" className="mt-7.5 text-center">
          <h2 className="mb-3 text-2xl font-bold text-slate-800  dark:text-white">{firstLine}</h2>
          <p className="font-medium">{secondLine}</p>
        </div>
      </div>
    </div>
  );
};

export default LargeErrorMessage;
