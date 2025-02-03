import { Any } from "@/common/types/types";

/**
 * Constructs a URL search parameters string from an object.
 * 
 * @param params - An object containing key-value pairs to convert to a query string.
 * @returns A string representing the URL search parameters.
 */
export function constructUrlSearchParams(params: Record<string, Any>): string {
  const queryParts: string[] = ["?"];

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      // Skip undefined or null values
      return;
    }

    if (Array.isArray(value)) {
      // Handle arrays
      value.forEach((item) => {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
      });
    } else {
      // Handle primitive values
      queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });

  // Join all parts with "&" and return the query string
  return queryParts.join('&');
}
