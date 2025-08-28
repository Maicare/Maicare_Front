import React, { FunctionComponent, PropsWithChildren } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAICare",
  description: "This is Login Page for MAICare",
};

const AuthLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <main className="h-[100vh]">
      <div className="h-full bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center h-full">
          

          <div className="w-full border-stroke dark:border-strokedark">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
