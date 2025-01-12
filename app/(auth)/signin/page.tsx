"use client";
import React from "react";
import Image from "next/image";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import Routes from "@/common/routes";
import LoginForm from "@/components/auth/login-form";


const SignIn: React.FC = () => {

  return (
    <div className="p-4 sm:p-12.5 xl:p-17.5">
      <div className="flex flex-col items-center justify-center mb-6 xl:hidden">
        <Image
          className="pb-2 dark:hidden"
          src={"/images/logo/logo.png"}
          alt="Logo"
          width={80}
          height={12}
        />
        <p className="2xl:px-20 text-[24px]">
          MAI<span className="font-bold">Care</span>
        </p>
      </div>
      <h2 className="text-2xl font-bold text-slate-800  mb-9 dark:text-white sm:text-title-xl2">
        Meld u aan op de website
      </h2>
      <LoginForm />

    </div >
  );
};

export default withAuth(SignIn, { mode: AUTH_MODE.LOGGED_OUT, redirectUrl: Routes.Common.Home });

