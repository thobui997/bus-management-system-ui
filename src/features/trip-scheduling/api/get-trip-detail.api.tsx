import { Trip } from '@app/features/trip-scheduling/types/trip.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getTripDetailApi = async (id: number) => {
  const { data, error } = await supabaseClient
    .from('trip')
    .select(
      `*,
      route:route_id(
        id,
        route_name,
        start_station:start_station_id(id, station_name),
        end_station:end_station_id(id, station_name)
      ),
      vehicle:vehicle_id(id, license_plate, brand, model),
      trip_assignments:trip_assignment(
        id,
        employee_id,
        role_in_trip,
        created_at,
        updated_at,
        employee:employee_id(
          id,
          user_id,
          full_name,
          email,
          phone_number,
          license_number,
          license_expiry
        )
      )`
    )
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Trip;
};

export const getTripDetailQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ['trip', id],
    queryFn: () => getTripDetailApi(id),
    enabled: !!id
  });
};

type UseTripDetailOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof getTripDetailQueryOptions>;
};

export const useTripDetail = ({ id, queryConfig = {} }: UseTripDetailOptions) => {
  return useQuery({
    ...getTripDetailQueryOptions(id),
    ...queryConfig
  });
};
