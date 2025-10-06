import { BaseResponse } from '@app/shared/types/base-response.type';

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  PENDING_PAYMENT = 'pendingPayment',
  CANCELLED = 'cancelled'
}

export interface Booking {
  id: number;
  customer_id: number;
  trip_id: number;
  booking_time: string;
  total_amount: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  customer?: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
  };
  trip?: {
    id: number;
    route_id: number;
    departure_time: string;
    arrival_time: string;
  };
}

export type BookingParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: BookingStatus;
  customer_id?: number;
  trip_id?: number;
};

export type BookingResponse = BaseResponse<Booking[]>;

export type BookingFormValues = {
  customer_id: number;
  trip_id: number;
  booking_time: string;
  total_amount: number;
  status: BookingStatus;
};
