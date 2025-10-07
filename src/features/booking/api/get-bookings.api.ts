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

  if (status) {
    query = query.eq('status', status);
  }

  if (customer_id) {
    query = query.eq('customer_id', customer_id);
  }

  if (trip_id) {
    query = query.eq('trip_id', trip_id);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching bookings:', error);
    throw new Error(error.message);
  }

  let filteredData = (data as Booking[]) || [];

  // Filter by search term in memory
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter((booking) => {
      const customerName = booking.customer?.full_name?.toLowerCase() || '';
      const customerEmail = booking.customer?.email?.toLowerCase() || '';
      const customerPhone = booking.customer?.phone_number?.toLowerCase() || '';
      return (
        customerName.includes(searchLower) || customerEmail.includes(searchLower) || customerPhone.includes(searchLower)
      );
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
