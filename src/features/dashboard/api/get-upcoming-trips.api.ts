import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { UpcomingTrip } from '../types/dashboard.type';

export const getUpcomingTripsApi = async (limit: number = 5): Promise<UpcomingTrip[]> => {
  const now = new Date().toISOString();

  const { data, error } = await supabaseClient
    .from('trip')
    .select(
      `
      id,
      departure_time,
      arrival_time,
      status,
      route:route_id(route_name),
      vehicle:vehicle_id(license_plate)
    `
    )
    .gte('departure_time', now)
    .order('departure_time', { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (
    data?.map((trip: any) => ({
      id: trip.id,
      route_name: trip.route?.route_name || 'N/A',
      departure_time: trip.departure_time,
      arrival_time: trip.arrival_time,
      vehicle_license: trip.vehicle?.license_plate || 'N/A',
      status: trip.status
    })) || []
  );
};

export const getUpcomingTripsQueryOptions = (limit: number = 5) => {
  return queryOptions({
    queryKey: ['upcoming-trips', limit],
    queryFn: () => getUpcomingTripsApi(limit),
    staleTime: 1000 * 60 * 2
  });
};

type UseUpcomingTripsOptions = {
  limit?: number;
  queryConfig?: QueryConfig<typeof getUpcomingTripsQueryOptions>;
};

export const useUpcomingTrips = ({ limit = 5, queryConfig = {} }: UseUpcomingTripsOptions = {}) => {
  return useQuery({
    ...getUpcomingTripsQueryOptions(limit),
    ...queryConfig
  });
};
