export function transformEmptyStringsToNull(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformEmptyStringsToNull(item));
  }

  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string' && value.trim() === '') {
        result[key] = null;
      } else if (typeof value === 'object' && value !== null) {
        result[key] = transformEmptyStringsToNull(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
};