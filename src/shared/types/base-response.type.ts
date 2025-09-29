export interface BaseResponse<T> {
  data: T;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
