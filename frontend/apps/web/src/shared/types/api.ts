export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  total: number;
  pagination?: Pagination;
}

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  error?: string;
}
