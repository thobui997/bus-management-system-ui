import { Vehicle, VehicleParams } from '@app/features/vehicle-management/vehicle-fleet/types/vehicle.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getVehiclesApi = async (params: VehicleParams = {}) => {
  const { search = '', page = 1, pageSize = 10, status, vehicle_type_id } = params;

  let query = supabaseClient
    .from('vehicle')
    .select('*, vehicle_type:vehicle_type_id(id, type_name)', { count: 'exact' });

  if (search) {
    query = query.or(`license_plate.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (vehicle_type_id) {
    query = query.eq('vehicle_type_id', vehicle_type_id);
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
    data: data as Vehicle[],
    total,
    page,
    pageSize,
    totalPages
  };
};

export const getVehiclesQueryOptions = (params: VehicleParams = {}) => {
  return queryOptions({
    queryKey: ['vehicles', params],
    queryFn: () => getVehiclesApi(params)
  });
};

type UseVehiclesOptions = {
  params?: VehicleParams;
  queryConfig?: QueryConfig<typeof getVehiclesQueryOptions>;
};

export const useVehicles = ({ queryConfig = {}, params = {} }: UseVehiclesOptions = {}) => {
  return useQuery({
    ...getVehiclesQueryOptions(params),
    ...queryConfig
  });
};
