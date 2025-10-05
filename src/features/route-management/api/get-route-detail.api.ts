import { Route } from '@app/features/route-management/types/route.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getRouteDetailApi = async (id: number) => {
  const { data, error } = await supabaseClient
    .from('route')
    .select(
      `*,
      start_station:start_station_id(id, station_name),
      end_station:end_station_id(id, station_name),
      route_stops:route_stop(
        id,
        station_id,
        stop_order,
        station:station_id(id, station_name, address)
      )`
    )
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Sort route_stops by stop_order
  const processedData = {
    ...data,
    route_stops: data.route_stops?.sort((a: any, b: any) => a.stop_order - b.stop_order)
  };

  return processedData as Route;
};

export const getRouteDetailQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ['route', id],
    queryFn: () => getRouteDetailApi(id),
    enabled: !!id
  });
};

type UseRouteDetailOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof getRouteDetailQueryOptions>;
};

export const useRouteDetail = ({ id, queryConfig = {} }: UseRouteDetailOptions) => {
  return useQuery({
    ...getRouteDetailQueryOptions(id),
    ...queryConfig
  });
};
