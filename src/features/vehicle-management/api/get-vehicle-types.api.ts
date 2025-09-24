import { VehicleType } from '@app/features/vehicle-management/types/vehicle-type.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getVehicleTypesApi = async () => {
  const { data, error } = await supabaseClient.from('vehicle_type').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data as VehicleType[];
};

export const getVehicleTypesQueryOptions = () => {
  return queryOptions({
    queryKey: ['vehicle-types'],
    queryFn: () => getVehicleTypesApi()
  });
};

type UseVehicleTypesOptions = {
  queryConfig?: QueryConfig<typeof getVehicleTypesQueryOptions>;
};

export const useVehicleTypes = ({ queryConfig = {} }: UseVehicleTypesOptions = {}) => {
  return useQuery({
    ...getVehicleTypesQueryOptions(),
    ...queryConfig
  });
};
