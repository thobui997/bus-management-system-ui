import { RouteFormValues } from '@app/features/route-management/types/route.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateRoutePayload extends RouteFormValues {
  id: number;
}

export const updateRouteApi = async (payload: UpdateRoutePayload) => {
  const { id, ...updateData } = payload;
  const { data, error } = await supabaseClient.from('route').update(updateData).eq('id', id).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseUpdateRouteOptions = {
  mutationConfig?: MutationConfig<typeof updateRouteApi>;
};

export const useUpdateRoute = ({ mutationConfig }: UseUpdateRouteOptions = {}) => {
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
    mutationFn: updateRouteApi
  });
};
