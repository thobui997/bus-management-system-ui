import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteVehicleTypeApi = async (id: number) => {
  const { error } = await supabaseClient.from('vehicle_type').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
};

type UseDeleteVehicleTypeOptions = {
  mutationConfig?: MutationConfig<typeof deleteVehicleTypeApi>;
};

export const useDeleteVehicleType = ({ mutationConfig }: UseDeleteVehicleTypeOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['vehicle-types']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteVehicleTypeApi
  });
};
