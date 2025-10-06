import { BaseResponse } from '@app/shared/types/base-response.type';

export interface Customer {
  id: number;
  user_id: string | null;
  full_name: string;
  phone_number: string | null;
  email: string | null;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}

export type CustomerParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type CustomerResponse = BaseResponse<Customer[]>;

export type CustomerFormValues = {
  full_name: string;
  phone_number?: string;
  email?: string;
  loyalty_points?: number;
};
