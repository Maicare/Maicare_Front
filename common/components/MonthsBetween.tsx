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
  return (
    <>
      {[
        months > 0 ? `${months} maanden` : "",
        remainingDays > 0 ? `${remainingDays} dagen` : "",
      ].join(" ")}
    </>
  );
};

export default MonthsBetween;
