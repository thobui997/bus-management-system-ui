import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteStationApi = async (id: number) => {
  const { error } = await supabaseClient.from('station').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
};

type UseDeleteStationOptions = {
  mutationConfig?: MutationConfig<typeof deleteStationApi>;
};

export const useDeleteStation = ({ mutationConfig }: UseDeleteStationOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['stations']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteStationApi
  });
};
