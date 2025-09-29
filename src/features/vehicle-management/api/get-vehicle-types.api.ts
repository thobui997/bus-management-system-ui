import { VehicleType, VehicleTypesParams } from '@app/features/vehicle-management/types/vehicle-type.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getVehicleTypesApi = async (params: VehicleTypesParams = {}) => {
  const { search = '', page = 1, pageSize = 10 } = params;

  let query = supabaseClient.from('vehicle_type').select('*', { count: 'exact' });

  if (search) {
    query = query.or(`type_name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  query = query.order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data as VehicleType[],
    total,
    page,
    pageSize,
    totalPages
  };
};

export const getVehicleTypesQueryOptions = (params: VehicleTypesParams = {}) => {
  return queryOptions({
    queryKey: ['vehicle-types', params],
    queryFn: () => getVehicleTypesApi(params)
  });
};

type UseVehicleTypesOptions = {
  params?: VehicleTypesParams;
  queryConfig?: QueryConfig<typeof getVehicleTypesQueryOptions>;
};

export const useVehicleTypes = ({ queryConfig = {}, params = {} }: UseVehicleTypesOptions = {}) => {
  return useQuery({
    ...getVehicleTypesQueryOptions(params),
    ...queryConfig
  });
};
