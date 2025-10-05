import { BaseResponse } from '@app/shared/types/base-response.type';

export enum MaintenanceLogStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed'
}

export interface MaintenanceLog {
  id: number;
  vehicle_id: number;
  maintenance_type: string;
  schedule_date: string;
  completion_date: string | null;
  cost: number;
  note: string;
  status: MaintenanceLogStatus;
  created_at: string;
  updated_at: string;
  vehicle?: {
    id: number;
    license_plate: string;
    brand: string;
    model: string;
  };
}

export type MaintenanceLogParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: MaintenanceLogStatus;
  vehicle_id?: number;
};

export type MaintenanceLogResponse = BaseResponse<MaintenanceLog[]>;

export type MaintenanceLogFormValues = {
  vehicle_id: number;
  maintenance_type: string;
  schedule_date: string;
  completion_date?: string;
  cost: number;
  note?: string;
  status: MaintenanceLogStatus;
};
