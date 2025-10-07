import { Customer, CustomerParams } from '@app/features/customer-management/types/customer.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getCustomersApi = async (params: CustomerParams = {}) => {
  const { search = '', page = 1, pageSize = 10 } = params;

  let query = supabaseClient.from('customer').select('*', { count: 'exact' });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,phone_number.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  query = query.order('updated_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data as Customer[],
    total,
    page,
    pageSize,
    totalPages
  };
};

export const getCustomersQueryOptions = (params: CustomerParams = {}) => {
  return queryOptions({
    queryKey: ['customers', params],
    queryFn: () => getCustomersApi(params)
  });
};

type UseCustomersOptions = {
  params?: CustomerParams;
  queryConfig?: QueryConfig<typeof getCustomersQueryOptions>;
};

export const useCustomers = ({ queryConfig = {}, params = {} }: UseCustomersOptions = {}) => {
  return useQuery({
    ...getCustomersQueryOptions(params),
    ...queryConfig
  });
};
