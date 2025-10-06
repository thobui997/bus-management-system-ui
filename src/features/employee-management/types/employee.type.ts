import { BaseResponse } from '@app/shared/types/base-response.type';

export interface Employee {
  id: number;
  user_id: string | null;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  license_number: string | null;
  license_expiry: string | null;
  created_at: string;
  updated_at: string;
}

export type EmployeeParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type EmployeeResponse = BaseResponse<Employee[]>;

export type EmployeeFormValues = {
  full_name: string;
  email?: string;
  phone_number?: string;
  license_number?: string;
  license_expiry?: string;
};
