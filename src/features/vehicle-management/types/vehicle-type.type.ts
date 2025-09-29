import { BaseResponse } from '@app/shared/types/base-response.type';

export interface VehicleType {
  id: number;
  type_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type VehicleTypesParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type VehicleTypesResponse = BaseResponse<VehicleType[]>;
