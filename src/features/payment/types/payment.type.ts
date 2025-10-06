import { BaseResponse } from '@app/shared/types/base-response.type';

export enum PaymentMethod {
  CASH = 'cash',
  E_WALLET = 'eWallet',
  BANK_TRANSFER = 'bankTransfer'
}

export enum PaymentStatus {
  SUCCESS = 'success',
  FAILED = 'failed'
}

export interface Payment {
  id: number;
  booking_id: number;
  payment_method: PaymentMethod;
  amount: number;
  transaction_time: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  booking?: {
    id: number;
    customer: {
      id: number;
      full_name: string;
      email: string;
      phone_number: string;
    };
    trip: {
      id: number;
      route_id: number;
      departure_time: string;
    };
    total_amount: number;
    booking_status: string;
  };
}

export type PaymentParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: PaymentStatus;
  payment_method?: PaymentMethod;
  booking_id?: number;
  date_from?: string;
  date_to?: string;
};

export type PaymentResponse = BaseResponse<Payment[]>;

export type PaymentFormValues = {
  booking_id: number;
  payment_method: PaymentMethod;
  amount: number;
  transaction_time: string;
  status: PaymentStatus;
};
