"use client";

import React, { FunctionComponent } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import ArrowRight from "@/components/icons/ArrowRight";

type Tab = {
  label: string;
  href: string;
};

type Props = {
  tabs: Tab[];
  title: string;
  backHref: string;
};

const PageTabs: FunctionComponent<Props> = ({ tabs, title, backHref }) => {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-baseline justify-between gap-2 px-6 pb-5 border-b py-7 border-stroke dark:border-strokedark">
      <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-800  dark:text-white">
        <Link href={backHref}>
          <ArrowRight className="rotate-180" height={12} width={24} />
        </Link>
        <span>{title}</span>
      </h3>
      <ul className="flex flex-wrap gap-3">
        {tabs.map(({ href, label }, index) => (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                "block rounded-md py-3 px-4 text-sm font-medium hover:bg-primary hover:text-white dark:hover:bg-primary md:text-base lg:px-6",
                pathname.startsWith(href)
                  ? "bg-primary text-white"
                  : "bg-c_gray dark:bg-meta-4 text-slate-800  dark:text-white"
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PageTabs;
