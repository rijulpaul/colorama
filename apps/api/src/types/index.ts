export type ApiResponse<T> = {
  data: T;
};

export type ApiError = {
  error: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};
