import { Payment } from '@app/features/payment/types/payment.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getPaymentDetailApi = async (id: number) => {
  const { data, error } = await supabaseClient
    .from('payment')
    .select(
      `*,
      booking:booking_id(
        id,
        total_amount,
        status,
        booking_time,
        customer:customer_id(id, full_name, email, phone_number),
        trip:trip_id(
          id,
          route_id,
          departure_time,
          arrival_time,
          route:route_id(route_name)
        )
      )`
    )
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Payment;
};

export const getPaymentDetailQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ['payment', id],
    queryFn: () => getPaymentDetailApi(id),
    enabled: !!id
  });
};

type UsePaymentDetailOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof getPaymentDetailQueryOptions>;
};

export const usePaymentDetail = ({ id, queryConfig = {} }: UsePaymentDetailOptions) => {
  return useQuery({
    ...getPaymentDetailQueryOptions(id),
    ...queryConfig
  });
};
