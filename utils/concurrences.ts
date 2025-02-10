
export const getUniqueConcurrencesObjects = <T, K extends keyof T>(arr: T[], field: K): T[] => {
    const seen = new Set<T[K]>(); // To track seen field values
    return arr.filter(item => {
        if (!seen.has(item[field])) {
            seen.add(item[field]);
            return true;
        }
        return false;
    });
};