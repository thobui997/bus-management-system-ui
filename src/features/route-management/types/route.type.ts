import { BaseResponse } from '@app/shared/types/base-response.type';

export interface Route {
  id: number;
  route_name: string;
  start_station_id: number;
  end_station_id: number;
  distance: number | null;
  standard_duration: number | null;
  created_at: string;
  updated_at: string;
  start_station?: {
    id: number;
    station_name: string;
  };
  end_station?: {
    id: number;
    station_name: string;
  };
  route_stops?: RouteStop[];
}

export interface RouteStop {
  id: number;
  route_id: number;
  station_id: number;
  stop_order: number;
  created_at: string;
  updated_at: string;
  station?: {
    id: number;
    station_name: string;
    address?: string;
  };
}

export type RouteParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type RouteResponse = BaseResponse<Route[]>;

export type RouteFormValues = {
  route_name: string;
  start_station_id: number;
  end_station_id: number;
  distance?: number;
  standard_duration?: number;
};

export type RouteStopFormValues = {
  route_id: number;
  station_id: number;
  stop_order: number;
};
