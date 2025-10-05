import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteVehicleApi = async (id: number) => {
  const { error } = await supabaseClient.from('vehicle').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
};

type UseDeleteVehicleOptions = {
  mutationConfig?: MutationConfig<typeof deleteVehicleApi>;
};

export const useDeleteVehicle = ({ mutationConfig }: UseDeleteVehicleOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['vehicles']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteVehicleApi
  });
};
