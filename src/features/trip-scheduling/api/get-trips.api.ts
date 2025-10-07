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

  query = query.order('updated_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  let filteredData = (data as Trip[]) || [];

  // Filter by search term in memory
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter((trip) => {
      const routeName = trip.route?.route_name?.toLowerCase() || '';
      const licensePlate = trip.vehicle?.license_plate?.toLowerCase() || '';
      return routeName.includes(searchLower) || licensePlate.includes(searchLower);
    });
  }

  // Calculate pagination
  const total = filteredData.length;
  const totalPages = Math.ceil(total / pageSize);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const paginatedData = filteredData.slice(from, to);

  return {
    data: paginatedData,
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
