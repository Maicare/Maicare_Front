import dayjs from "dayjs";

export function monthsBetween(date1: Date, date2: Date) {
  const months = dayjs(date2).diff(date1, "month", false);
  const remainingDays = dayjs(date2).diff(dayjs(date1).add(months, "month"), "day");
  return { months, remainingDays };
}
