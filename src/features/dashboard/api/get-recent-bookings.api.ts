import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { RecentBooking } from '../types/dashboard.type';

export const getRecentBookingsApi = async (limit: number = 5): Promise<RecentBooking[]> => {
  const { data, error } = await supabaseClient
    .from('booking')
    .select(
      `
      id,
      total_amount,
      status,
      customer:customer_id(full_name),
      trip:trip_id(
        departure_time,
        route:route_id(route_name)
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (
    data?.map((booking: any) => ({
      id: booking.id,
      customer_name: booking.customer?.full_name || 'N/A',
      route_name: booking.trip?.route?.route_name || 'N/A',
      departure_time: booking.trip?.departure_time || '',
      total_amount: booking.total_amount,
      status: booking.status
    })) || []
  );
};

export const getRecentBookingsQueryOptions = (limit: number = 5) => {
  return queryOptions({
    queryKey: ['recent-bookings', limit],
    queryFn: () => getRecentBookingsApi(limit),
    staleTime: 1000 * 60 * 2 // 2 phút
  });
};

type UseRecentBookingsOptions = {
  limit?: number;
  queryConfig?: QueryConfig<typeof getRecentBookingsQueryOptions>;
};

export const useRecentBookings = ({ limit = 5, queryConfig = {} }: UseRecentBookingsOptions = {}) => {
  return useQuery({
    ...getRecentBookingsQueryOptions(limit),
    ...queryConfig
  });
};
