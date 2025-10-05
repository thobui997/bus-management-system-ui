import { Station, StationParams } from '@app/features/station-management/types/station.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getStationsApi = async (params: StationParams = {}) => {
  const { search = '', page = 1, pageSize = 10 } = params;

  let query = supabaseClient.from('station').select('*', { count: 'exact' });

  if (search) {
    query = query.or(`station_name.ilike.%${search}%,address.ilike.%${search}%`);
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
    data: data as Station[],
    total,
    page,
    pageSize,
    totalPages
  };
};

export const getStationsQueryOptions = (params: StationParams = {}) => {
  return queryOptions({
    queryKey: ['stations', params],
    queryFn: () => getStationsApi(params)
  });
};

type UseStationsOptions = {
  params?: StationParams;
  queryConfig?: QueryConfig<typeof getStationsQueryOptions>;
};

export const useStations = ({ queryConfig = {}, params = {} }: UseStationsOptions = {}) => {
  return useQuery({
    ...getStationsQueryOptions(params),
    ...queryConfig
  });
};
