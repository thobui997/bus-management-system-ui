import { RouteFormValues } from '@app/features/route-management/types/route.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createRouteApi = async (payload: RouteFormValues) => {
  const { data, error } = await supabaseClient.from('route').insert([payload]).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseCreateRouteOptions = {
  mutationConfig?: MutationConfig<typeof createRouteApi>;
};

export const useCreateRoute = ({ mutationConfig }: UseCreateRouteOptions = {}) => {
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
    mutationFn: createRouteApi
  });
};
