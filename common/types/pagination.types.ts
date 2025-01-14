

export type PaginatedResponse<T> = {
    next: string | null;
    previous: string | null;
    count: number;
    page_size: number;
    results: T[];
}