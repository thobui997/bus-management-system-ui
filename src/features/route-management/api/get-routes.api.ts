import { Route, RouteParams } from '@app/features/route-management/types/route.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getRoutesApi = async (params: RouteParams = {}) => {
  const { search = '', page = 1, pageSize = 10 } = params;

  let query = supabaseClient.from('route').select(
    `*,
      start_station:start_station_id(id, station_name),
      end_station:end_station_id(id, station_name),
      route_stops:route_stop(
        id,
        station_id,
        stop_order,
        station:station_id(id, station_name, address)
      )`,
    { count: 'exact' }
  );

  if (search) {
    query = query.ilike('route_name', `%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  query = query.order('updated_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // Sort route_stops by stop_order
  const processedData = (data as Route[])?.map((route) => ({
    ...route,
    route_stops: route.route_stops?.sort((a, b) => a.stop_order - b.stop_order)
  }));

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: processedData,
    total,
    page,
    pageSize,
    totalPages
  };
};

export const getRoutesQueryOptions = (params: RouteParams = {}) => {
  return queryOptions({
    queryKey: ['routes', params],
    queryFn: () => getRoutesApi(params)
  });
};

type UseRoutesOptions = {
  params?: RouteParams;
  queryConfig?: QueryConfig<typeof getRoutesQueryOptions>;
};

export const useRoutes = ({ queryConfig = {}, params = {} }: UseRoutesOptions = {}) => {
  return useQuery({
    ...getRoutesQueryOptions(params),
    ...queryConfig
  });
};
