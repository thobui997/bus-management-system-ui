import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteRouteApi = async (id: number) => {
  // First delete all route_stops
  const { error: stopsError } = await supabaseClient.from('route_stop').delete().eq('route_id', id);

  if (stopsError) {
    throw new Error(stopsError.message);
  }

  // Then delete the route
  const { error } = await supabaseClient.from('route').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
};

type UseDeleteRouteOptions = {
  mutationConfig?: MutationConfig<typeof deleteRouteApi>;
};

export const useDeleteRoute = ({ mutationConfig }: UseDeleteRouteOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['routes']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteRouteApi
  });
};
