import { VehicleFormValues } from '@app/features/vehicle-management/vehicle-fleet/types/vehicle.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createVehicleApi = async (payload: VehicleFormValues) => {
  const { data, error } = await supabaseClient.from('vehicle').insert([payload]).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseCreateVehicleOptions = {
  mutationConfig?: MutationConfig<typeof createVehicleApi>;
};

export const useCreateVehicle = ({ mutationConfig }: UseCreateVehicleOptions = {}) => {
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
    mutationFn: createVehicleApi
  });
};
