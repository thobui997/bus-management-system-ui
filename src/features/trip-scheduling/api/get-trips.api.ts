import { Trip, TripParams } from '@app/features/trip-scheduling/types/trip.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getTripsApi = async (params: TripParams = {}) => {
  const { search = '', page = 1, pageSize = 10, status, route_id, vehicle_id, date } = params;

  let query = supabaseClient.from('trip').select(
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
      )`,
    { count: 'exact' }
  );

  if (search) {
    query = query.or(`route.route_name.ilike.%${search}%,vehicle.license_plate.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (route_id) {
    query = query.eq('route_id', route_id);
  }

  if (vehicle_id) {
    query = query.eq('vehicle_id', vehicle_id);
  }

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    query = query.gte('departure_time', startOfDay.toISOString()).lte('departure_time', endOfDay.toISOString());
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  query = query.order('departure_time', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data as Trip[],
    total,
    page,
    pageSize,
    totalPages
  };
};

export const getTripsQueryOptions = (params: TripParams = {}) => {
  return queryOptions({
    queryKey: ['trips', params],
    queryFn: () => getTripsApi(params)
  });
};

type UseTripsOptions = {
  params?: TripParams;
  queryConfig?: QueryConfig<typeof getTripsQueryOptions>;
};

export const useTrips = ({ queryConfig = {}, params = {} }: UseTripsOptions = {}) => {
  return useQuery({
    ...getTripsQueryOptions(params),
    ...queryConfig
  });
};
