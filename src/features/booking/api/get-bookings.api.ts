import { Booking, BookingParams } from '@app/features/booking/types/booking.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getBookingsApi = async (params: BookingParams = {}) => {
  const { search = '', page = 1, pageSize = 10, status, customer_id, trip_id } = params;

  let query = supabaseClient.from('booking').select(
    `*,
      customer:customer_id(id, full_name, email, phone_number),
      trip:trip_id(id, route_id, departure_time, arrival_time),
      tickets:ticket(id, seat_number, price, qrcode)`,
    { count: 'exact' }
  );

  if (search) {
    query = query.or(`customer.full_name.ilike.%${search}%,customer.email.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (customer_id) {
    query = query.eq('customer_id', customer_id);
  }

  if (trip_id) {
    query = query.eq('trip_id', trip_id);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  query = query.order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching bookings:', error);
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data as Booking[],
    total,
    page,
    pageSize,
    totalPages
  };
};

export const getBookingsQueryOptions = (params: BookingParams = {}) => {
  return queryOptions({
    queryKey: ['bookings', params],
    queryFn: () => getBookingsApi(params)
  });
};

type UseBookingsOptions = {
  params?: BookingParams;
  queryConfig?: QueryConfig<typeof getBookingsQueryOptions>;
};

export const useBookings = ({ queryConfig = {}, params = {} }: UseBookingsOptions = {}) => {
  return useQuery({
    ...getBookingsQueryOptions(params),
    ...queryConfig
  });
};
