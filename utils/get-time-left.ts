/**
 * Calculates the time left until a given end date
 * @param endDate The end date as a string (format: MM/DD/YYYY)
 * @returns A human-readable string representing the time left
 */
export function getTimeLeft(endDate: string): string {
  // Parse the end date (MM/DD/YYYY format)
  const [month, day, year] = endDate.split('/').map(Number);
  const end = new Date(year, month - 1, day); // Month is 0-indexed in JS Date

  const now = new Date();
  const diffMs = end.getTime() - now.getTime();

  // If the date has already passed
  if (diffMs <= 0) {
    return "Expired";
  }

  // Calculate time components
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  // Return appropriate format based on time remaining
  if (diffDays > 365) {
    const years = Math.floor(diffDays / 365);
    const remainingDays = diffDays % 365;
    return `${years} year${years > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  } else if (diffDays > 30) {
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ${diffSeconds} second${diffSeconds > 1 ? 's' : ''}`;
  } else {
    return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''}`;
  }
}