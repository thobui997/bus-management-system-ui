import { Payment, PaymentParams } from '@app/features/payment/types/payment.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getPaymentsApi = async (params: PaymentParams = {}) => {
  const { search = '', page = 1, pageSize = 10, status, payment_method, booking_id, date_from, date_to } = params;

  let query = supabaseClient.from('payment').select(
    `*,
      booking:booking_id(
        id,
        total_amount,
        status,
        customer:customer_id(id, full_name, email, phone_number),
        trip:trip_id(id, route_id, departure_time)
      )`,
    { count: 'exact' }
  );

  if (search) {
    query = query.or(`booking.customer.full_name.ilike.%${search}%,booking.customer.email.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (payment_method) {
    query = query.eq('payment_method', payment_method);
  }

  if (booking_id) {
    query = query.eq('booking_id', booking_id);
  }

  if (date_from) {
    query = query.gte('transaction_time', date_from);
  }

  if (date_to) {
    query = query.lte('transaction_time', date_to);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  query = query.order('transaction_time', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data as Payment[],
    total,
    page,
    pageSize,
    totalPages
  };
};

export const getPaymentsQueryOptions = (params: PaymentParams = {}) => {
  return queryOptions({
    queryKey: ['payments', params],
    queryFn: () => getPaymentsApi(params)
  });
};

type UsePaymentsOptions = {
  params?: PaymentParams;
  queryConfig?: QueryConfig<typeof getPaymentsQueryOptions>;
};

export const usePayments = ({ queryConfig = {}, params = {} }: UsePaymentsOptions = {}) => {
  return useQuery({
    ...getPaymentsQueryOptions(params),
    ...queryConfig
  });
};
