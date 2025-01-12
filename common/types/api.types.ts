export type ApiResponse<T> = {
    data?: T;
    message: string;
    success: boolean;
    error?: string;
};

export type UseFetchResponse<T> = {
    data: T | undefined;
    error: Error | undefined;
    isLoading: boolean;
    mutate: (
      data?: T | Promise<T>,
      shouldRevalidate?: boolean
    ) => Promise<T | undefined>;
  };