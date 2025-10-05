import { VehicleFormValues } from '@app/features/vehicle-management/vehicle-fleet/types/vehicle.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateVehiclePayload extends VehicleFormValues {
  id: number;
}

export const updateVehicleApi = async (payload: UpdateVehiclePayload) => {
  const { id, ...updateData } = payload;
  const { data, error } = await supabaseClient.from('vehicle').update(updateData).eq('id', id).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseUpdateVehicleOptions = {
  mutationConfig?: MutationConfig<typeof updateVehicleApi>;
};

export const useUpdateVehicle = ({ mutationConfig }: UseUpdateVehicleOptions = {}) => {
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
    mutationFn: updateVehicleApi
  });
};
