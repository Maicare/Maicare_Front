import { format, parseISO } from "date-fns";
import dayjs from "dayjs";
import { nl } from 'date-fns/locale';
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

export const formatDateToDutch = (dateString: string | Date, isDay: boolean = false): string => {
  let date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const months = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december"
  ];

  const month = months[date.getUTCMonth()]; // Get month in Dutch
  const year = date.getUTCFullYear(); // Get year
  if (isDay) {
    const day = date.getUTCDate(); // Get day
    const daySuffix = (day: number): string => {
      const suffixes = ["ste", "de", "de", "de", "de", "de", "de", "de", "de", "de"];
      return suffixes[day % 10] || "";
    }
    const dayWithSuffix = `${day}${daySuffix(day)}`; // Add suffix to day
    const formattedDate = `${dayWithSuffix} ${month} ${year}`; // Format date
    return formattedDate;
  }

  return `${month} ${year}`;
};
export function createDateFromTimeString(timeString: string): Date {
  // Get today's date
  const today = new Date();
  
  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create a new Date object with today's date and the specified time
  const dateWithTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hours,
    minutes
  );
  
  return dateWithTime;
}
export function formatTimeFromDate(date: Date): string {
  // Get hours and minutes
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}
// Helper function to format the backend date
export function formatBackendDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
export function formatDutchDateTimeWithAMPM(isoString: string) {
  const date = parseISO(isoString);
  
  const formattedDate = format(date, 'd\'e\' MMM yyyy', { locale: nl });
  const formattedTime = format(date, 'hh:mm a', { locale: nl }); // 'a' gives AM/PM
  
  return {
    date: formattedDate,
    time: formattedTime.toLowerCase() // "07:30 am"
  };
}