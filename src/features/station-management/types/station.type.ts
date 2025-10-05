import { BaseResponse } from '@app/shared/types/base-response.type';

export interface Station {
  id: number;
  station_name: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export type StationParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type StationResponse = BaseResponse<Station[]>;

export type StationFormValues = {
  station_name: string;
  address?: string;
};
