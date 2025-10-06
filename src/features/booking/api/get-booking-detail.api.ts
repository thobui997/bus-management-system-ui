import { Booking } from '@app/features/booking/types/booking.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getBookingDetailApi = async (id: number) => {
  const { data, error } = await supabaseClient
    .from('booking')
    .select(
      `*,
      customer:customer_id(id, full_name, email, phone_number),
      trip:trip_id(id, route_id, departure_time, arrival_time),
      tickets:ticket(id, seat_number, price, qrcode, created_at, updated_at)`
    )
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Booking;
};

export const getBookingDetailQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ['booking', id],
    queryFn: () => getBookingDetailApi(id),
    enabled: !!id
  });
};

type UseBookingDetailOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof getBookingDetailQueryOptions>;
};

export const useBookingDetail = ({ id, queryConfig = {} }: UseBookingDetailOptions) => {
  return useQuery({
    ...getBookingDetailQueryOptions(id),
    ...queryConfig
  });
};
