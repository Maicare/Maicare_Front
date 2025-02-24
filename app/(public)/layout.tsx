import React, { FunctionComponent, PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAICare",
  description: "This is a Public Page for MAICare",
};

const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <main className="min-h-screen bg-white dark:bg-boxdark">
      <header className="p-4">
        <Link href="/public">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <Image
                className="hidden dark:block"
                src={"/images/logo/logo.png"}
                alt="Logo"
                width={100}
                height={32}
              />
              <Image
                className="dark:hidden"
                src={"/images/logo/logo.ico"}
                alt="Logo"
                width={50}
                height={15}
              />
            </div>
            <p className="text-lg font-normal">
              MAI<span className="font-bold">Care</span>
            </p>
          </div>
        </Link>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        {children}
      </div>
    </main>
  );
};

export default PublicLayout;
