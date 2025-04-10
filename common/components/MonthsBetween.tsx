import React, { FunctionComponent, useMemo } from "react";
import dayjs from "dayjs";
import { monthsBetween } from "@/utils/monthsBetween";

const MonthsBetween: FunctionComponent<{
  startDate: string;
  endDate: string;
}> = ({ startDate, endDate }) => {
  const { months, remainingDays } = useMemo(
    () => monthsBetween(dayjs(startDate).toDate(), dayjs(endDate).toDate()),
    [startDate, endDate]
  );
  // Build display string; if both values are 0, show "0 dagen"
  const display = [
    months > 0 ? `${months} maanden` : "",
    remainingDays > 0 ? `${remainingDays} dagen` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <>{display || "0 dagen"}</>;
};

export default MonthsBetween;
