import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateRouteStopsPayload {
  routeId: number;
  stops: Array<{
    id?: number;
    station_id: number;
    stop_order: number;
  }>;
}

export const updateRouteStopsApi = async (payload: UpdateRouteStopsPayload) => {
  const { routeId, stops } = payload;

  // Delete existing stops
  const { error: deleteError } = await supabaseClient.from('route_stop').delete().eq('route_id', routeId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  // Insert new stops
  if (stops.length > 0) {
    const newStops = stops.map((stop) => ({
      route_id: routeId,
      station_id: stop.station_id,
      stop_order: stop.stop_order
    }));

    const { data, error } = await supabaseClient.from('route_stop').insert(newStops).select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  return [];
};

type UseUpdateRouteStopsOptions = {
  mutationConfig?: MutationConfig<typeof updateRouteStopsApi>;
};

export const useUpdateRouteStops = ({ mutationConfig }: UseUpdateRouteStopsOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['routes']
      });
      queryClient.invalidateQueries({
        queryKey: ['route', variables.routeId]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: updateRouteStopsApi
  });
};
