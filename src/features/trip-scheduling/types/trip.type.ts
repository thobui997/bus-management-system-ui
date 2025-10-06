import { Employee } from '@app/features/employee-management/types/employee.type';
import { BaseResponse } from '@app/shared/types/base-response.type';

export enum TripStatus {
  ON_TIME = 'onTime',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled'
}

export enum RoleInTrip {
  DRIVER = 'driver',
  ASSISTANT = 'assistant'
}

export interface Trip {
  id: number;
  route_id: number;
  vehicle_id: number;
  departure_time: string;
  arrival_time: string;
  status: TripStatus;
  created_at: string;
  updated_at: string;
  route?: {
    id: number;
    route_name: string;
    start_station?: {
      id: number;
      station_name: string;
    };
    end_station?: {
      id: number;
      station_name: string;
    };
  };
  vehicle?: {
    id: number;
    license_plate: string;
    brand: string;
    model: string;
  };
  trip_assignments?: TripAssignment[];
}

export interface TripAssignment {
  id: number;
  trip_id: number;
  employee_id: number;
  role_in_trip: RoleInTrip;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export type TripParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: TripStatus;
  route_id?: number;
  vehicle_id?: number;
  date?: string;
};

export type TripResponse = BaseResponse<Trip[]>;

export type TripFormValues = {
  route_id: number;
  vehicle_id: number;
  departure_time: string;
  arrival_time: string;
  status: TripStatus;
};

export type TripAssignmentFormValues = {
  trip_id: number;
  employee_id: number;
  role_in_trip: RoleInTrip;
};
