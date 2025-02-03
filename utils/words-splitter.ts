export const wordCount = (value: string | undefined): boolean => {
    if (!value) return false;
    const words = value.trim().split(/\s+/); // Splits by spaces, handling multiple spaces
    return words.length >= 50;
  };