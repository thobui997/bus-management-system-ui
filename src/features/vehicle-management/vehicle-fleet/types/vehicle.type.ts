import { BaseResponse } from '@app/shared/types/base-response.type';

export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired'
}

export interface Vehicle {
  id: number;
  license_plate: string;
  vehicle_type_id: number;
  brand: string;
  model: string;
  year_manufactured: number;
  seat_capacity: number;
  manufacturer: string;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
  vehicle_type?: {
    id: number;
    type_name: string;
  };
}

export type VehicleParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: VehicleStatus;
  vehicle_type_id?: number;
};

export type VehicleResponse = BaseResponse<Vehicle[]>;

export type VehicleFormValues = {
  license_plate: string;
  vehicle_type_id: number;
  brand: string;
  model: string;
  year_manufactured: number;
  seat_capacity: number;
  manufacturer: string;
  status: VehicleStatus;
};
