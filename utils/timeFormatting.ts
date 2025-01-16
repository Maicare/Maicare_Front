import dayjs from "dayjs";
import "dayjs/locale/nl";
dayjs.locale("nl");

export const DATE_FORMAT = "DD MMM YYYY";

export function dateFormat(date: string | Date) {
  return dayjs(date).format(DATE_FORMAT);
}

export const SHORT_DATE_FORMAT = "D/M/YY";

export function shortDateFormat(date: string | Date) {
  return dayjs(date).format(SHORT_DATE_FORMAT);
}

export const FULL_DATE_FORMAT = "dddd DD MMMM YYYY";
export function fullDateFormat(date: string | Date) {
  return dayjs(date).format(FULL_DATE_FORMAT);
}

export const SHORT_DATE_TIME_FORMAT = "D MMM YY, HH:mm";
export function shortDateTimeFormat(date: string | Date) {
  return dayjs(date).format(SHORT_DATE_TIME_FORMAT);
}

export const FULL_DATE_TIME_FORMAT = "dddd DD MMMM YYYY HH:mm";
export function fullDateTimeFormat(date: string | Date) {
  return dayjs(date).format(FULL_DATE_TIME_FORMAT);
}

export const TIME_FORMAT = "HH:mm";
export function timeFormat(date: string | Date) {
  return dayjs(date).format(TIME_FORMAT);
}

export const DAY_FORMAT = "DD dddd";
export function dayFormat(date: string | Date) {
  return dayjs(date).format(DAY_FORMAT);
}

export const DAY_MONTH_FORMAT = "DD MMM";
export function dayMonthFormat(date: string | Date) {
  return dayjs(date).format(DAY_MONTH_FORMAT);
}

export const MONTH_FORMAT = "MMMM";
export function monthFormat(date: string | Date) {
  return dayjs(date).format(MONTH_FORMAT);
}

export const MONTH_YEAR_FORMAT = "MMMM YYYY";
export function monthYearFormat(date: string | Date) {
  return dayjs(date).format(MONTH_YEAR_FORMAT);
}
