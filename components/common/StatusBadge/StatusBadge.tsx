import { BadgeType } from "@/common/types/badge-type.types";
import React, { FunctionComponent, ReactNode, useMemo } from "react";

type BadgeProps = {
  text: ReactNode;
};

type Props = BadgeProps & {
  type: BadgeType;
};

const BadgesRecord: Record<Props["type"], FunctionComponent<BadgeProps>> = {
  Primary: ({ text }) => (
    <div className="inline-flex rounded-full bg-primary py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90 dark:bg-primary-dark dark:text-white">
      {text}
    </div>
  ),
  Secondary: ({ text }) => (
    <div className="inline-flex rounded-full bg-[#13C296] py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90 dark:bg-[#13C296] dark:text-white">
      {text}
    </div>
  ),
  Success: ({ text }) => (
    <div className="inline-flex rounded-full bg-[#3CA745] py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90 dark:bg-[#3CA745] dark:text-white">
      {text}
    </div>
  ),
  Dark: ({ text }) => (
    <div className="inline-flex rounded-full bg-[#212B36] py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90 dark:bg-[#212B36] dark:text-white">
      {text}
    </div>
  ),
  Light: ({ text }) => (
    <div className="inline-flex rounded-full bg-slate-50 py-1 px-3 text-sm font-medium text-slate-800 hover:bg-opacity-90 dark:bg-[#EFEFEF] dark:text-[#212B36]">
      {text}
    </div>
  ),
  Gray: ({ text }) => (
    <div className="inline-flex rounded-full bg-[#637381] py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90 dark:bg-[#637381] dark:text-white">
      {text}
    </div>
  ),
  Danger: ({ text }) => (
    <div className="inline-flex rounded-full bg-[#DC3545] py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90 dark:bg-[#DC3545] dark:text-white">
      {text}
    </div>
  ),
  Warning: ({ text }) => (
    <div className="inline-flex rounded-full bg-[#F9C107] py-1 px-3 text-sm font-medium text-[#212B36] hover:bg-opacity-90 dark:bg-[#F9C107] dark:text-[#212B36]">
      {text}
    </div>
  ),
  Info: ({ text }) => (
    <div className="inline-flex rounded-full bg-[#3BA2B8] py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90 dark:bg-[#3BA2B8] dark:text-white">
      {text}
    </div>
  ),
  Outline: ({ text }) => (
    <div className="inline-flex rounded-full border border-[#EFEFEF] bg-slate-100 py-1 px-3 text-sm font-medium text-[#212B36] hover:bg-opacity-90 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
      {text}
    </div>
  ),
};

const StatusBadge: FunctionComponent<Props> = ({ type, text }) => {
  const Badge = useMemo(() => BadgesRecord[type] ?? BadgesRecord.Light, [type]);
  return <Badge text={text} />;
};

export default StatusBadge;
